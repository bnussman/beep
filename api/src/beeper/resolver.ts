import { sendNotification } from '../utils/notifications';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { Beep } from '../entities/Beep';
import { Arg, Args, Authorized, Ctx, Field, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { Context } from '../utils/context';
import { BeeperSettingsInput, UpdateQueueEntryInput } from './args';
import * as Sentry from '@sentry/node';
import { QueueEntry } from '../entities/QueueEntry';
import { User } from '../entities/User';
import { inOrder } from '../utils/sort';
import { Point } from '../location/resolver';
import { sha256 } from 'js-sha256';
import { BeeperLocationArgs } from '../location/args';

@ObjectType()
export class AnonymousBeeper {
  @Field()
  public id!: string;

  @Field({ nullable: true })
  public latitude?: number;

  @Field({ nullable: true })
  public longitude?: number;
}

@Resolver(Beep)
export class BeeperResolver {

  @Query(() => [AnonymousBeeper])
  @Authorized("No Verification")
  public async getAllBeepersLocation(@Ctx() ctx: Context, @Args() { latitude, longitude, radius }: BeeperLocationArgs): Promise<AnonymousBeeper[]> {
    if (radius === 0) {
      const beepers = await ctx.em.find(User, { isBeeping: true });

      return beepers.map(({ id, location }) => ({ id: sha256(id).substring(0, 9), latitude: location?.latitude, longitude: location?.longitude }));
    }

    const connection = ctx.em.getConnection();

    const raw: User[] = await connection.execute(`SELECT location, id FROM public."user" WHERE ST_DistanceSphere(location, ST_MakePoint(${latitude},${longitude})) <= ${radius} * 1609.34 AND is_beeping = true ORDER BY ST_DistanceSphere(location, ST_MakePoint(${latitude},${longitude}))`);

    const data = raw.map(user => ctx.em.map(User, user));

    return data.map(({ id, location }) => ({ id: sha256(id).substring(0, 9), latitude: location?.latitude, longitude: location?.longitude }));
  }

  @Mutation(() => User)
  @Authorized()
  public async setBeeperStatus(@Ctx() ctx: Context, @Arg('input') input: BeeperSettingsInput, @PubSub() pubSub: PubSubEngine): Promise<User> {

    if (!input.isBeeping) {
      const queue = await ctx.user.queue.loadItems();
      if (queue.length > 0) {
        throw new Error("You can't stop beeping when you still have beeps to complete or riders in your queue");
      }
    }

    if (!!input.latitude && !!input.longitude) {
      wrap(ctx.user).assign({ ...input, location: new Point(input.latitude, input.longitude) });
    } 
    else {
      wrap(ctx.user).assign(input);
    }

    pubSub.publish("User" + ctx.user.id, ctx.user);

    await ctx.em.persistAndFlush(ctx.user);

    return ctx.user;
  }

  @Mutation(() => [QueueEntry])
  @Authorized()
  public async setBeeperQueue(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('input') input: UpdateQueueEntryInput): Promise<QueueEntry[]> {
    await ctx.em.populate(ctx.user, ['queue', 'queue.rider', 'cars'], { where: { cars: { default: true } }, orderBy: { queue: { start: QueryOrder.ASC } } });

    const queueEntry = ctx.user.queue.getItems().find((entry: QueueEntry) => entry.id === input.id);

    if (!queueEntry) throw new Error("Can't find queue entry");

    const isAcceptingOrDenying = input.state === 1 || input.state === -1;

    const numRidersBefore = isAcceptingOrDenying ? ctx.user.queue.getItems().filter((entry: QueueEntry) => entry.start < queueEntry.start && entry.state === 0).length : ctx.user.queue.getItems().filter((entry: QueueEntry) => entry.start < queueEntry.start && entry.state > 0).length;

    if (numRidersBefore !== 0) {
      throw new Error("You must respond to the rider who first joined your queue.");
    }

    queueEntry.state = input.state;

    if (input.state === 1) {
      ctx.user.queueSize = ctx.user.queue.getItems().filter((entry) => entry.state > 0).length;

      ctx.em.persist(ctx.user);
    }

    if (input.state === -1 || input.state === 5) {
      pubSub.publish("Rider" + queueEntry.rider.id, null);

      if (input.state === 5) {
        const beep = new Beep(queueEntry);

        ctx.em.persist(beep);
      }

      ctx.user.queue.remove(queueEntry);

      ctx.user.queueSize = ctx.user.queue.getItems().filter(entry => entry.state > 0).length;

      ctx.em.persist(ctx.user);
    }

    switch (queueEntry.state) {
      case -1:
        sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} has denied your beep request 🚫`, "Open your app to find a diffrent beeper.");
        break;
      case 1:
        sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} has accepted your beep request ✅`, "You will recieve another notification when they are on their way to pick you up.");
        break;
      case 2:
        sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} is on their way 🚕`, "Your beeper is on their way to pick you up.");
        break;
      case 3:
        sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} is here 📍`, `Look for a ${ctx.user.cars[0]?.color} ${ctx.user.cars[0]?.make} ${ctx.user.cars[0]?.model}`);
        break;
      case 4:
        // Beep is in progress - no notification needed at this stage.
        break;
      case 5:
        // Beep is complete.
        break;
      default:
        Sentry.captureException("Our beeper's state notification switch statement reached a point that is should not have");
    }

    const queue = ctx.user.queue.getItems().sort(inOrder);

    await ctx.em.persistAndFlush(queueEntry);

    this.sendRiderUpdates(ctx.user, queue, pubSub);

    return queue;
  }

  private async sendRiderUpdates(beeper: User, queue: QueueEntry[], pubSub: PubSubEngine) {
    pubSub.publish("Beeper" + beeper.id, queue);

    for (const entry of queue) {
      entry.position = queue.filter((_entry: QueueEntry) => _entry.start < entry.start).length;

      pubSub.publish("Rider" + entry.rider.id, entry);
    }
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async cancelBeep(@Ctx() ctx: Context, @Arg('id') id: string, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
    const entry = ctx.em.getReference(QueueEntry, id);

    await ctx.user.queue.init({ orderBy: { start: QueryOrder.ASC }, populate: ['rider', 'beeper'] });

    const newQueue = ctx.user.queue.getItems().filter(entry => entry.id !== id);

    pubSub.publish("Beeper" + ctx.user.id, newQueue);

    for (const entry of ctx.user.queue) {
      if (entry.id === id) {
        sendNotification(entry.rider.pushToken, "Beep Canceled 🚫", `Your beeper, ${ctx.user.name()}, has canceled the beep`);
        pubSub.publish("Rider" + entry.rider.id, null);
      }
      else {
        entry.position = newQueue.filter((_entry: QueueEntry) => _entry.start < entry.start).length;
        pubSub.publish("Rider" + entry.rider.id, entry);
      }
    }

    ctx.user.queue.remove(entry);

    ctx.user.queueSize = ctx.user.queue.getItems().filter(entry => entry.state > 0).length;

    await ctx.em.persistAndFlush(ctx.user);

    return true;
  }

  @Subscription(() => [QueueEntry], {
    topics: ({ args }) => "Beeper" + args.id,
  })
  @Authorized('self')
  public async getBeeperUpdates(@Arg("id") id: string, @Root() entry: QueueEntry[]): Promise<QueueEntry[]> {
    return entry;
  }
}
