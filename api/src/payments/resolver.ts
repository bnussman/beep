import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import type { Context } from "../utils/context";
import { Paginated, PaginationArgs } from "../utils/pagination";
import { QueryOrder } from "@mikro-orm/core";
import { Payment, Product, Store, productExpireTimes, productPrice } from '../entities/Payment';
import { User } from "../entities/User";
import { REVENUE_CAT_SECRET } from "../utils/constants";
import { SubscriberResponse } from "../users/types";
import { EntityManager } from "@mikro-orm/postgresql";

@ObjectType()
class PaymentResponse extends Paginated(Payment) {}

@Resolver()
export class PaymentsResolver {
  @Query(() => PaymentResponse)
  @Authorized('self')
  public async getPayments(@Ctx() ctx: Context, @Args(() => PaginationArgs) { offset, show }: PaginationArgs, @Arg('id', () => String, { nullable: true }) id?: string): Promise<PaymentResponse> {
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
  public async getPaymentHistory(@Ctx() ctx: Context, @Args(() => PaginationArgs) { offset, show }: PaginationArgs, @Arg('id', () => String, { nullable: true }) id?: string): Promise<PaymentResponse> {
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
  public async checkUserSubscriptions(@Ctx() ctx: Context, @Arg("id", () => String, { nullable: true }) id?: string): Promise<Payment[]> {
    return syncUserPayments(ctx.em, id ?? ctx.user.id);
  }
}

export async function syncUserPayments(em: EntityManager, userId: string): Promise<Payment[]> {
  if (!userId) {
    throw new Error("No user id provided when syncing payments.");
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${REVENUE_CAT_SECRET}`
    }
  };

  const request = await fetch(`https://api.revenuecat.com/v1/subscribers/${userId}`, options);

  const response: SubscriberResponse = await request.json();

  const products = Object.keys(response.subscriber.non_subscriptions) as Product[];

  for (const product of products) {
    for (const payment of response.subscriber.non_subscriptions[product]) {

      const created = new Date(payment.purchase_date);

     try {
      await em.insert(
        Payment,
        new Payment({
          id: payment.id,
          store: payment.store as Store,
          user: em.getReference(User, userId),
          storeId: payment.store_transaction_id,
          price: productPrice[product],
          productId: product,
          created,
          expires: new Date(created.getTime() + productExpireTimes[product])
        })
      );
     } catch (error) {
       console.error(error)
     }
    }
  }

  const activePayments = await em.find(
    Payment,
    { user: userId },
    { filters: { active: true } }
  );

  return activePayments;
}
