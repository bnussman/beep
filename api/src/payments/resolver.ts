import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Context } from "../utils/context";
import { Paginated, PaginationArgs } from "../utils/pagination";
import { QueryOrder } from "@mikro-orm/core";
import { Payment, Product, Store, productExpireTimes, productPrice } from '../entities/Payments';
import { User } from "../entities/User";
import { REVENUE_CAT_SECRET } from "../utils/constants";
import { SubscriberResponse } from "../users/types";
import { EntityManager } from "@mikro-orm/postgresql";
import * as Sentry from '@sentry/node';

@ObjectType()
class PaymentResponse extends Paginated(Payment) {}

@Resolver()
export class PaymentsResolver {
  @Query(() => PaymentResponse)
  @Authorized('self')
  public async getPayments(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string): Promise<PaymentResponse> {
    const [items, count] = await ctx.em.findAndCount(
      Payment,
      {},
      {
        populate: ['user'],
        offset,
        limit: show,
        orderBy: { created: QueryOrder.DESC },
        filters: id ? { in: { id }, active: true } : undefined
      }
    );

    return { items, count };
  }

  @Query(() => PaymentResponse)
  @Authorized('self')
  public async getPaymentHistory(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string): Promise<PaymentResponse> {
    const [items, count] = await ctx.em.findAndCount(
      Payment,
      {},
      {
        populate: ['user'],
        offset,
        limit: show,
        orderBy: { created: QueryOrder.DESC },
        filters: id ? { in: { id } } : undefined
      }
    );

    return { items, count };
  }

  @Mutation(() => [Payment], { nullable: true })
  @Authorized('No Verification Self')
  public async checkUserSubscriptions(@Ctx() ctx: Context, @Arg("id", { nullable: true }) id?: string): Promise<Payment[]> {
    return syncUserPayments(ctx.em, id ?? ctx.user.id);
  }
}

export async function syncUserPayments(em: EntityManager, userId: string): Promise<Payment[]> {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${REVENUE_CAT_SECRET}`
    }
  };

  const request = await fetch(`https://api.revenuecat.com/v1/subscribers/${userId}`, options);

  const response: SubscriberResponse = await request.json();

  const user = await em.findOneOrFail(User, userId, { populate: ['payments.id'] });

  const products = Object.keys(response.subscriber.non_subscriptions) as Product[];

  for (const product of products) {
    for (const payment of response.subscriber.non_subscriptions[product]) {

      if (user.payments.exists(p => p.id === payment.id)) {
        continue;
      }

      const created = new Date(payment.purchase_date);

      user.payments.add(new Payment({
        id: payment.id,
        store: payment.store as Store,
        user,
        storeId: payment.store_transaction_id,
        price: productPrice[product],
        productId: product,
        created,
        expires: new Date(created.getTime() + productExpireTimes[product])
      }));
    }
  }

  await em.persistAndFlush(user);

  const activePayments = user.payments.filter(payment => payment.expires >= new Date());

  return activePayments;
}
