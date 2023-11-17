import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Context } from "../utils/context";
import { Paginated, PaginationArgs } from "../utils/pagination";
import { QueryOrder } from "@mikro-orm/core";
import { Payment, Product, Store, productExpireTimes, productPrice } from '../entities/Payments';
import { User } from "../entities/User";
import { REVENUE_CAT_SECRET } from "../utils/constants";
import { SubscriberResponse } from "../users/types";

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

  @Mutation(() => [Payment], { nullable: true })
  @Authorized('No Verification Self')
  public async checkUserSubscriptions(@Ctx() ctx: Context, @Arg("id", { nullable: true }) id?: string): Promise<Payment[]> {
    const options = { method: 'GET', headers: { accept: 'application/json', Authorization: `Bearer ${REVENUE_CAT_SECRET}` } };

    const request = await fetch(`https://api.revenuecat.com/v1/subscribers/${id ?? ctx.user.id}`, options);

    const response: SubscriberResponse = await request.json();

    const user = await ctx.em.findOneOrFail(User, id ?? ctx.user.id);
    const products = Object.keys(response.subscriber.non_subscriptions) as Product[];

    for (const product of products) {
      for (const payment of response.subscriber.non_subscriptions[product].reverse()) {
        const created = new Date(payment.purchase_date);

        const p = new Payment({
          id: payment.id,
          store: payment.store as Store,
          user,
          storeId: payment.store_transaction_id,
          price: productPrice[product],
          productId: product,
          created,
          expires: new Date(created.getTime() + productExpireTimes[product])
        })

        try {
          await ctx.em.insert(p);
        } catch (e) {
          await user.payments.init({ where: { expires: { '$gte': new Date() }}});

          return user.payments.getItems();
        }
      }
    }

    await user.payments.init({ where: { expires: { '$gte': new Date() }}});

    return user.payments.getItems();
  }
}
