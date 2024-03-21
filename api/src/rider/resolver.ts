import { sendNotification } from '../utils/notifications';
import { QueryOrder, raw } from '@mikro-orm/core';
import { User } from '../entities/User';
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver, Root, Subscription } from 'type-graphql';
import { GetBeepInput, GetBeepersArgs } from './args';
import { Context } from '../utils/context';
import { Beep, Status } from '../entities/Beep';
import { Rating } from '../entities/Rating';
import { getPositionInQueue, getQueueSize } from '../utils/dist';
import { pubSub } from '../utils/pubsub';
import { GraphQLError } from 'graphql';

@Resolver()
export class RiderResolver {
  @Mutation(() => Beep)
  @Authorized()
  public async chooseBeep(@Ctx() ctx: Context, @Arg('beeperId') beeperId: string, @Arg('input') input: GetBeepInput): Promise<Beep> {
    const beeper = await ctx.em.findOneOrFail(
      User,
      beeperId,
      {
        populate: ['queue', 'queue.rider', 'cars'],
        orderBy: { queue: { start: QueryOrder.ASC } },
        filters: ['inProgress']
      }
    );

    if (!beeper.isBeeping) {
      throw new GraphQLError("The user you have chosen is no longer beeping at this time.");
    }

    if (beeper.queue.getItems().some(beep => beep.rider.id === ctx.user.id)) {
      throw new GraphQLError("You are already in an in progress beep.");
    }

    const { groupSize, origin, destination } = input;

    const entry = new Beep({
      groupSize,
      origin,
      destination,
      rider: ctx.user,
      beeper,
      start: new Date(),
      status: Status.WAITING
    });

    beeper.queue.add(entry);

    const queue = beeper.queue.getItems();

    entry.position = getPositionInQueue(queue, entry);

    await ctx.em.persistAndFlush(beeper);

    sendNotification({
      token: beeper.pushToken,
      title: `${ctx.user.name()} has entered your queue 🚕`,
      message: "Please open your app to accept or deny this rider.",
      categoryId: "newbeep",
      data: { id: entry.id }
    });

    pubSub.publish("beeperQueue", beeper.id, queue);

    return entry;
  }

  @Query(() => Beep, { nullable: true })
  @Authorized()
  public async getRiderStatus(@Ctx() ctx: Context): Promise<Beep | null> {
    const beep = await ctx.em.findOne(
      Beep,
      {
        rider: ctx.user,
      },
      {
        populateWhere: { beeper: { cars: { default: true } }},
        populate: ['beeper', 'beeper.cars'],
        filters: ['inProgress']
      }
    );

    if (!beep) {
      return null;
    }

    beep.position = await ctx.em.count(
      Beep,
      {
        beeper: beep.beeper,
        start: {
          $lt: beep.start
        },
        status: { $ne: Status.WAITING }
      },
      {
        filters: ['inProgress']
      }
    );

    return beep;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async leaveQueue(@Ctx() ctx: Context, @Arg('id') id: string): Promise<boolean> {
    const beeper = await ctx.em.findOneOrFail(
      User,
      id,
      {
        populateWhere: { cars: { default: true } },
        populate: ['queue', 'queue.rider', 'cars', 'queue.beeper'],
        filters: ['inProgress'],
        orderBy: { queue: { start: QueryOrder.ASC } }
      }
    );

    let queue = beeper.queue.getItems();

    const entry = queue.find((beep) => beep.rider.id === ctx.user.id);

    if (!entry) {
      throw new GraphQLError("You are not in that beepers queue.");
    }

    sendNotification({
      token: beeper.pushToken,
      title: `${ctx.user.name()} left your queue 🥹`,
      message: "They decided they did not want a beep from you!"
    });

    entry.status = Status.CANCELED;
    entry.end = new Date();

    queue = queue.filter(beep => beep.status !== Status.CANCELED);

    pubSub.publish("currentRide", ctx.user.id, null);
    pubSub.publish("beeperQueue", beeper.id, queue);

    for (const entry of queue) {
      entry.position = getPositionInQueue(queue, entry);

      pubSub.publish("currentRide", entry.rider.id, { ...entry, beeper });
    }

    beeper.queueSize = getQueueSize(queue);

    await ctx.em.persistAndFlush(beeper);

    return true;
  }

  @Query(() => [User])
  @Authorized()
  public async getBeepers(@Ctx() ctx: Context, @Args() { latitude, longitude, radius }: GetBeepersArgs): Promise<User[]> {
    if (radius === 0) {
      return await ctx.em.find(User, { isBeeping: true });
    }

    const users = await ctx.em.createQueryBuilder(User, 'u')
      .select("*")
      .leftJoinAndSelect("u.payments", 'p', { "p.expires": { '$gte': new Date() } })
      .where('ST_DistanceSphere(u.location, ST_MakePoint(?,?)) <= ? * 1609.34', [latitude, longitude, radius])
      .andWhere({ isBeeping: true })
      .orderBy({
        [raw("CASE WHEN p.product_id LIKE 'top_of_beeper_list_%' THEN 1 ELSE 0 END")]: QueryOrder.DESC,
        [raw(`ST_DistanceSphere(u.location, ST_MakePoint(?,?))`, [latitude, longitude])]: QueryOrder.ASC
      })
      .getResultList();

    return users;
  }

  @Query(() => Beep, { nullable: true })
  @Authorized()
  public async getLastBeepToRate(@Ctx() ctx: Context): Promise<Beep | null> {
    const beep = await ctx.em.findOne(
      Beep,
      {
        rider: ctx.user.id,
        status: Status.COMPLETE,
      },
      {
        populate: ['beeper'],
        orderBy: { start: QueryOrder.DESC }
      }
    );

    if (!beep) {
      return null;
    }

    const count = await ctx.em.count(
      Rating,
      {
        rater: ctx.user.id,
        rated: beep.beeper.id,
        timestamp: { $gte: beep.end }
      }
    );

    if (count > 0) {
      return null;
    }

    return beep;
  }

  @Subscription(() => Beep, {
    nullable: true,
    topics: "currentRide",
    topicId: ({ context }) => context.user.id,
  })
  public getRiderUpdates(@Root() entry: Beep | null): Beep | null {
    // This is a bug with current pubsub
    if (typeof entry === 'string') {
      return null;
    }
    return entry;
  }
}
