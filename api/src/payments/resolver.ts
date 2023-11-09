import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Context } from "../utils/context";
import { Paginated, PaginationArgs } from "../utils/pagination";
import { QueryOrder } from "@mikro-orm/core";
import { Payment, Store } from '../entities/Payments';
import { User, UserRole } from "../entities/User";
import { REVENUE_CAT_SECRET } from "../utils/constants";
import { SubscriberResponse } from "../users/types";

@ObjectType()
class PaymentResponse extends Paginated(Payment) {}

@Resolver()
export class PaymentsResolver {
  @Query(() => PaymentResponse)
  @Authorized(UserRole.ADMIN)
  public async getPayments(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs): Promise<PaymentResponse> {
    const [items, count] = await ctx.em.findAndCount(Payment, {}, { populate: ['user'], offset, limit: show, orderBy: { created: QueryOrder.DESC } });

    return { items, count };
  }

  @Query(() => Payment, { nullable: true })
  @Authorized()
  public async getTopOfQueueStatus(@Ctx() ctx: Context): Promise<Payment | null> {
    const payment = ctx.em.findOne(
      Payment,
      { user: ctx.user.id, expires: { '$gte': new Date() } },
      { orderBy: { created: QueryOrder.DESC }
    });

    return payment;
  }

  @Mutation(() => Payment, { nullable: true })
  @Authorized('No Verification Self')
  public async checkUserSubscriptions(@Ctx() ctx: Context, @Arg("id", { nullable: true }) id?: string): Promise<Payment | null> {
    const options = { method: 'GET', headers: { accept: 'application/json', Authorization: `Bearer ${REVENUE_CAT_SECRET}` } };

    const request = await fetch(`https://api.revenuecat.com/v1/subscribers/${id ?? ctx.user.id}`, options);
    const response: SubscriberResponse = await request.json();

    const user = await ctx.em.findOneOrFail(User, id ?? ctx.user.id);

    const purchases = response.subscriber.non_subscriptions['top_of_beeper_list_1_hour'].reverse();

    for (const p of purchases) {
      const created = new Date(p.purchase_date);

      try {
        await ctx.em.insert(new Payment({
          id: p.id,
          store: p.store as Store,
          user,
          storeId: p.store_transaction_id,
          productId: "top_of_beeper_list_1_hour",
          created,
          expires: new Date(created.getTime() + (1 * 60 * 60 * 1000))
        }));
      } catch (e) {
        const payment = ctx.em.findOne(
          Payment,
          { user: id ?? ctx.user.id, expires: { '$lte': new Date() } },
          { orderBy: { created: QueryOrder.DESC }
          });

        return payment;
      }
    }

    const payment = ctx.em.findOne(
      Payment,
      { user: id ?? ctx.user.id, expires: { '$lte': new Date() } },
      { orderBy: { created: QueryOrder.DESC }
    });

    return payment;
  }

}
