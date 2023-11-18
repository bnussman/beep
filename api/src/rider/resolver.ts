import { sendNotification } from '../utils/notifications';
import { LoadStrategy, QueryOrder } from '@mikro-orm/core';
import { User } from '../entities/User';
import { Arg, Args, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { GetBeepInput, GetBeepersArgs } from './args';
import { Context } from '../utils/context';
import { Beep, Status } from '../entities/Beep';
import { Rating } from '../entities/Rating';
import { getPositionInQueue, getQueueSize } from '../utils/dist';

@Resolver()
export class RiderResolver {
  @Mutation(() => Beep)
  @Authorized()
  public async chooseBeep(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('beeperId') beeperId: string, @Arg('input') input: GetBeepInput): Promise<Beep> {
    const beeper = await ctx.em.findOneOrFail(
      User,
      beeperId,
      {
        populate: ['queue', 'queue.rider', 'cars'],
        strategy: LoadStrategy.SELECT_IN,
        orderBy: { queue: { start: QueryOrder.ASC } },
        filters: ['inProgress']
      }
    );

    if (!beeper.isBeeping) {
      throw new Error("The user you have chosen is no longer beeping at this time.");
    }

    if (beeper.queue.getItems().some(beep => beep.rider.id === ctx.user.id)) {
      throw new Error("You are already in an in progress beep.");
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

    sendNotification(beeper.pushToken, `${ctx.user.name()} has entered your queue 🚕`, "Please open your app to accept or deny this rider.");

    pubSub.publish("Beeper" + beeper.id, queue);

    return entry;
  }

  @Query(() => Beep, { nullable: true })
  @Authorized()
  public async getRiderStatus(@Ctx() ctx: Context): Promise<Beep | null> {
    const beep = await ctx.em.findOne(
      Beep,
      {
        rider: ctx.user,
        beeper: {
          cars: {
            default: true
          }
        },
      },
      {
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
  public async leaveQueue(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('id') id: string): Promise<boolean> {
    const beeper = await ctx.em.findOneOrFail(
      User,
      { id, cars: { default: true } },
      {
        strategy: LoadStrategy.SELECT_IN,
        populate: ['queue', 'queue.rider', 'cars'],
        filters: ['inProgress'],
        orderBy: { queue: { start: QueryOrder.ASC } }
      }
    );

    let queue = beeper.queue.getItems();

    const entry = queue.find((beep) => beep.rider.id === ctx.user.id);

    if (!entry) {
      throw new Error("You are not in that beepers queue.");
    }

    sendNotification(beeper.pushToken, `${ctx.user.name()} left your queue 🥹`, "They decided they did not want a beep from you!");

    entry.status = Status.CANCELED;
    entry.end = new Date();

    queue = queue.filter(beep => beep.status !== Status.CANCELED);

    pubSub.publish("Rider" + ctx.user.id, null);
    pubSub.publish("Beeper" + beeper.id, queue);

    for (const entry of queue) {
      entry.position = getPositionInQueue(queue, entry);

      pubSub.publish("Rider" + entry.rider.id, { ...entry, beeper });
    }

    beeper.queueSize = getQueueSize(queue);

    await ctx.em.persistAndFlush(beeper);

    return true;
  }

  @Query(() => [User])
  @Authorized()
  public async getBeepersNew(@Ctx() ctx: Context, @Args() { latitude, longitude, radius }: GetBeepersArgs): Promise<User[]> {
    if (radius === 0) {
      return await ctx.em.find(User, { isBeeping: true });
    }

    const users = await ctx.em.createQueryBuilder(User, 'u')
      .select("*")
      .joinAndSelect("u.payments", 'p', { "p.expires": { '$gte': new Date() } }, "leftJoin")
      .where('ST_DistanceSphere(u.location, ST_MakePoint(?,?)) <= ? * 1609.34', [latitude, longitude, radius])
      .andWhere({ isBeeping: true })
      .orderBy({
        ["CASE WHEN p.product_id LIKE 'top_of_beeper_list_%' THEN 1 ELSE 0 END"]: QueryOrder.DESC,
        [`ST_DistanceSphere(u.location, ST_MakePoint(${latitude},${longitude}))`]: QueryOrder.ASC
      })
      .getResultList();

    return users;
  }

  @Query(() => [User])
  @Authorized()
  public async getBeepers(@Ctx() ctx: Context, @Args() { latitude, longitude, radius }: GetBeepersArgs): Promise<User[]> {
    if (radius === 0) {
      return await ctx.em.find(User, { isBeeping: true });
    }

    const connection = ctx.em.getConnection();

    const raw: User[] = await connection.execute(`
SELECT * FROM public."user" WHERE ST_DistanceSphere(location, ST_MakePoint(${latitude},${longitude})) <= ${radius} * 1609.34 AND is_beeping = true ORDER BY ST_DistanceSphere(location, ST_MakePoint(${latitude},${longitude}))
`);

    return raw.map(user => ctx.em.map(User, user));
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
    topics: ({ context }) => "Rider" + context.user.id,
  })
  public getRiderUpdates(@Root() entry: Beep): Beep | null {
    return entry;
  }
}
