import { sendNotification } from '../utils/notifications';
import { QueryOrder } from '@mikro-orm/core';
import { QueueEntry } from '../entities/QueueEntry';
import { User } from '../entities/User';
import { Arg, Args, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { GetBeepInput, GetBeepersArgs } from './args';
import { Context } from '../utils/context';
import { Beep } from '../entities/Beep';
import { Rating } from '../entities/Rating';
import { inOrder } from '../utils/sort';

@Resolver()
export class RiderResolver {
  @Mutation(() => QueueEntry)
  @Authorized()
  public async chooseBeep(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('beeperId') beeperId: string, @Arg('input') input: GetBeepInput): Promise<QueueEntry> {
    const beeper = await ctx.em.findOneOrFail(User, beeperId, { populate: ['queue', 'queue.rider'] });

    if (!beeper.isBeeping) {
      throw new Error("The user you have chosen is no longer beeping at this time.");
    }

    const { groupSize, origin, destination } = input;

    const entry = new QueueEntry({ groupSize, origin, destination, rider: ctx.user, beeper });

    beeper.queue.add(entry);

    const queue = beeper.queue.getItems().sort(inOrder);

    entry.position = beeper.queue.getItems().filter((_entry: QueueEntry) => _entry.start < entry.start && _entry.state > 0).length;

    await ctx.em.persistAndFlush(beeper);

    sendNotification(beeper.pushToken, `${ctx.user.name()} has entered your queue 🚕`, "Please open your app to accept or deny this rider.");

    pubSub.publish("Beeper" + beeper.id, queue);

    return entry;
  }

  @Query(() => QueueEntry, { nullable: true })
  @Authorized()
  public async getRiderStatus(@Ctx() ctx: Context): Promise<QueueEntry | null> {
    const entry = await ctx.em.findOne(
      QueueEntry,
      { rider: ctx.user, beeper: { cars: { default: true }} },
      {
        populate: ['beeper', 'beeper.queue', 'beeper.cars'],
      }
    );

    if (!entry) {
      return null;
    }

    entry.position = entry.beeper.queue.getItems().filter((_entry: QueueEntry) => _entry.start < entry.start && _entry.state > 0).length;

    return entry;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async riderLeaveQueue(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('id') id: string): Promise<boolean> {
    const beeper = await ctx.em.findOneOrFail(User, { id, cars: { default: true } }, { populate: ['queue', 'queue.rider', 'cars'] });

    const entry = beeper.queue.getItems().find((_entry: QueueEntry) => _entry.rider.id === ctx.user.id);

    if (!entry) {
      throw new Error("You are not in that beepers queue.");
    }

    sendNotification(beeper.pushToken, `${ctx.user.name()} left your queue 🥹`, "They decided they did not want a beep from you!");

    beeper.queue.remove(entry);

    const queue = beeper.queue.getItems();

    pubSub.publish("Rider" + ctx.user.id, null);
    pubSub.publish("Beeper" + beeper.id, queue.sort(inOrder));

    for (const entry of queue) {
      entry.position = queue.filter((_entry: QueueEntry) => _entry.start < entry.start && _entry.state > 0).length;

      pubSub.publish("Rider" + entry.rider.id, { ...entry, beeper });
    }

    beeper.queueSize = beeper.queue.getItems().filter(entry => entry.state > 0).length;

    await ctx.em.persistAndFlush(beeper);

    return true;
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

    const data = raw.map(user => ctx.em.map(User, user));

    return data;
  }

  @Query(() => Beep, { nullable: true })
  @Authorized()
  public async getLastBeepToRate(@Ctx() ctx: Context): Promise<Beep | null> {
    const beep = await ctx.em.findOne(Beep, { rider: ctx.user.id }, { populate: ['beeper'], orderBy: { end: QueryOrder.DESC } });

    if (!beep) return null;

    const count = await ctx.em.count(Rating, { rater: ctx.user.id, rated: beep.beeper.id, timestamp: { $gte: beep.end } });

    if (count > 0) {
      return null;
    }

    return beep;
  }

  @Subscription(() => QueueEntry, {
    nullable: true,
    topics: ({ args }) => "Rider" + args.id,
  })
  @Authorized('self')
  public getRiderUpdates(@Arg("id") id: string, @Root() entry: QueueEntry): QueueEntry | null {
    return entry;
  }
}
