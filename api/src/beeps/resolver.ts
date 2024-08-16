import { Beep, Status } from '../entities/Beep';
import { LoadStrategy, QueryOrder } from '@mikro-orm/core';
import { Arg, Args, Authorized, Ctx, Info, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Paginated, PaginationArgs } from '../utils/pagination';
import { User, UserRole } from '../entities/User';
import type { Context } from '../utils/context';
import { GraphQLError } from 'graphql';
import type { GraphQLResolveInfo } from 'graphql';
import fieldsToRelations from '@bnussman/graphql-fields-to-relations';
import { PushNotification, sendNotifications } from '../utils/notifications';
import { pubSub } from '../utils/pubsub';

@ObjectType()
class BeepsResponse extends Paginated(Beep) {}

@Resolver(Beep)
export class BeepResolver {

  @Query(() => BeepsResponse)
  @Authorized('self')
  public async getBeeps(
    @Ctx() ctx: Context,
    @Info() info: GraphQLResolveInfo,
    @Args(() => PaginationArgs) { offset, show }: PaginationArgs,
    @Arg('id', () => String, { nullable: true }) id?: string
  ): Promise<BeepsResponse> {
    const populate = fieldsToRelations<Beep>(info, { root: 'items' });

    const [beeps, count] = await ctx.em.findAndCount(
      Beep,
      {},
      {
        orderBy: { start: QueryOrder.DESC },
        limit: show,
        offset: offset,
        populate,
        filters: id ? { in: { id } } : undefined
      }
    );

    return {
      items: beeps,
      count: count
    };
  }

  @Query(() => Beep)
  @Authorized(UserRole.ADMIN)
  public async getBeep(@Ctx() ctx: Context, @Arg('id', () => String) id: string): Promise<Beep> {
    const beep = await ctx.em.findOne(Beep, id, { populate: ['beeper', 'rider'] });

    if (!beep) {
      throw new GraphQLError("This beep entry does not exist");
    }

    return beep;
  }

  @Mutation(() => Boolean)
  @Authorized(UserRole.ADMIN)
  public async deleteBeep(@Ctx() ctx: Context, @Arg('id', () => String) id: string): Promise<boolean> {
    const beep = ctx.em.getReference(Beep, id);

    await ctx.em.removeAndFlush(beep);

    return true;
  }

  @Query(() => [Beep])
  @Authorized("self")
  public async getQueue(@Ctx() ctx: Context, @Info() info: GraphQLResolveInfo, @Arg("id", () => String, { nullable: true }) id?: string): Promise<Beep[]> {
    const populate = fieldsToRelations<Beep>(info);

    return await ctx.em.find(
      Beep,
      { beeper: id ?? ctx.user.id },
      {
        orderBy: { start: QueryOrder.ASC },
        populate,
        filters: ['inProgress']
      }
    );
  }

  @Query(() => BeepsResponse)
  @Authorized(UserRole.ADMIN)
  public async getInProgressBeeps(@Ctx() ctx: Context, @Args(() => PaginationArgs) { offset, show }: PaginationArgs): Promise<BeepsResponse> {
    const [beeps, count] = await ctx.em.findAndCount(
      Beep,
      {},
      {
        orderBy: { start: QueryOrder.DESC },
        limit: show,
        offset: offset,
        populate: ['beeper', 'rider'],
        filters: ['inProgress']
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
    @Arg('id', () => String) id: string,
    @Arg('stopBeeping', () => Boolean) stopBeeping: boolean,
  ): Promise<boolean> {
    const user = await ctx.em.findOneOrFail(
      User,
      id,
      {
        strategy: LoadStrategy.SELECT_IN,
        populate: ['queue', 'queue.rider'],
        filters: ['inProgress']
      }
    );

    if (user.queueSize === 0 && user.queue.length === 0) {
      throw new GraphQLError('Queue is already clear!');
    }

    const entries: Beep[] = user.queue.getItems();

    const toSend: PushNotification[] = [];

    for (const entry of entries) {
      pubSub.publish("currentRide", entry.rider.id, null);
      entry.status = Status.CANCELED;

      if (entry.rider.pushToken) {
        toSend.push({
          to: entry.rider.pushToken,
          title: 'You are no longer getting a ride!',
          body: "An admin cleared your beeper's queue probably because they were inactive."
        });
      }
    }

    if (user.pushToken) {
      toSend.push({
        to: user.pushToken,
        title: 'Your queue has been cleared',
        body: 'An admin has cleared your queue probably because you were inactive!'
      });
    }

    sendNotifications(toSend);

    if (stopBeeping) {
      user.isBeeping = false;
      pubSub.publish("user", id, user);
    }

    user.queueSize = 0;

    pubSub.publish("beeperQueue", id, []);

    await ctx.em.flush();

    return true;
  }
}
