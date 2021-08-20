import { QueueEntry } from "../entities/QueueEntry";
import { User, UserRole } from "../entities/User";
import { Context } from "../utils/context";
import { PushNotification, sendNotification, sendNotifications } from "../utils/notifications";
import { Arg, Args, Authorized, Ctx, Info, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver } from "type-graphql";
import fieldsToRelations from "graphql-fields-to-relations";
import { GraphQLResolveInfo } from "graphql";
import { QueryOrder } from "@mikro-orm/core";
import PaginationArgs from "../args/Pagination";
import { Paginated } from "../utils/paginated";

@ObjectType()
class BeepsInProgressResponse extends Paginated(QueueEntry) {}

@Resolver(QueueEntry)
export class QueueResolver {

  @Query(() => [QueueEntry])
  @Authorized('self')
  public async getQueue(@Ctx() ctx: Context, @Info() info: GraphQLResolveInfo, @Arg("id", { nullable: true }) id?: string): Promise<QueueEntry[]> {
    const populate = fieldsToRelations(info);

    return await ctx.em.find(QueueEntry, { beeper: id || ctx.user.id }, { orderBy: { start: QueryOrder.ASC }, populate });
  }

  @Query(() => BeepsInProgressResponse)
  @Authorized(UserRole.ADMIN)
  public async getInProgressBeeps(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs): Promise<BeepsInProgressResponse> {
    const [beeps, count] = await ctx.em.findAndCount(
      QueueEntry,
      {},
      {
        orderBy: { start: QueryOrder.DESC },
        limit: show,
        offset: offset,
        populate: ['beeper', 'rider'],
      }
    );

    return {
      items: beeps,
      count: count
    };
  }


  @Mutation(() => Boolean)
  @Authorized(UserRole.ADMIN)
  public async clearQueue(
    @Ctx() ctx: Context,
    @Arg('id') id: string,
    @Arg('stopBeeping') stopBeeping: boolean,
    @PubSub() pubSub: PubSubEngine
  ): Promise<boolean> {
    const user = await ctx.em.findOneOrFail(User, id, { populate: ['queue', 'queue.rider'] });

    if (user.queueSize === 0 && user.queue.length === 0) throw new Error('Queue is already clear!');

    const entries: QueueEntry[] = user.queue.getItems();

    const toSend: PushNotification[] = entries.map((entry: QueueEntry) => {
      pubSub.publish("Rider" + entry.rider.id, null);
      return {
        to: entry.rider.pushToken,
        title: 'You are no longer getting a ride!',
        body: "An admin cleared your beeper's queue probably because they were inactive."
      };
    });

    sendNotifications(toSend);
    sendNotification(
      user.pushToken,
      'Your queue has been cleared',
      'An admin has cleared your queue probably because you were inactive!'
    );

    if (stopBeeping) {
      user.isBeeping = false;
      pubSub.publish("User" + id, user);
    }

    user.queueSize = 0;
    user.queue.removeAll();

    pubSub.publish("Beeper" + id, []);

    await ctx.em.flush();

    return true;
  }
}