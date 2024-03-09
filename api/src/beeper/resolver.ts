import * as Sentry from '@sentry/node';
import { sendNotification } from '../utils/notifications';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { Beep, Status } from '../entities/Beep';
import { Arg, Args, Authorized, Ctx, Field, Mutation, ObjectType, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { Context } from '../utils/context';
import { BeeperSettingsInput, UpdateQueueEntryInput } from './args';
import { User } from '../entities/User';
import { Point } from '../location/resolver';
import { sha256 } from 'js-sha256';
import { BeeperLocationArgs } from '../location/args';
import { Car } from '../entities/Car';
import { getPositionInQueue, getQueueSize } from '../utils/dist';

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

    const users = await ctx.em.createQueryBuilder(User, 'u')
      .select(["id", "location"])
      .where('ST_Distance_Sphere(u.location, ST_SRID(POINT(?,?), 4326)) <= ? * 1609.34', [latitude, longitude, radius])
      .andWhere({ isBeeping: true })
      .getResultList();

    return users.map(({ id, location }) => ({ id: sha256(id).substring(0, 9), latitude: location?.latitude, longitude: location?.longitude }));
  }

  @Mutation(() => User)
  @Authorized()
  public async setBeeperStatus(@Ctx() ctx: Context, @Arg('input') input: BeeperSettingsInput, @PubSub() pubSub: PubSubEngine): Promise<User> {
    if (input.isBeeping) {
      const car = await ctx.em.findOne(Car, { user: ctx.user.id, default: true });

      if (!car) {
        throw new Error("You need to add a car to your account to beep.");
      }
    } else {
      const queueSize = await ctx.em.count(Beep, { beeper: ctx.user.id }, { filters: ['inProgress'] });

      if (queueSize > 0) {
        throw new Error("You can't stop beeping when you still have riders in your queue");
      }
    }

    if (!!input.latitude && !!input.longitude) {
      wrap(ctx.user).assign({
        singlesRate: input.singlesRate,
        groupRate: input.groupRate,
        capacity: input.capacity,
        isBeeping: input.isBeeping,
        location: new Point(input.latitude, input.longitude)
      });
    }
    else {
      wrap(ctx.user).assign({
        isBeeping: input.isBeeping,
      });
    }

    pubSub.publish("User" + ctx.user.id, ctx.user);

    await ctx.em.persistAndFlush(ctx.user);

    return ctx.user;
  }

  @Mutation(() => [Beep])
  @Authorized()
  public async setBeeperQueue(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('input') input: UpdateQueueEntryInput): Promise<Beep[]> {
    await ctx.em.populate(
      ctx.user,
      ['queue', 'queue.rider', 'queue.beeper', 'queue.beeper.cars'],
      {
        where: { cars: { default: true } },
        filters: ['inProgress'],
        orderBy: { queue: { start: QueryOrder.ASC } }
      }
    );

    const queueEntry = ctx.user.queue.getItems().find((entry) => entry.id === input.id);

    if (!queueEntry) throw new Error("Can't find queue entry");

    const isAcceptingOrDenying = input.status === Status.ACCEPTED || input.status === Status.DENIED;

    const numRidersBefore = isAcceptingOrDenying ? ctx.user.queue.getItems().filter((entry) => entry.start < queueEntry.start && entry.status === Status.WAITING).length : ctx.user.queue.getItems().filter((entry) => entry.start < queueEntry.start && entry.status !== Status.WAITING).length;

    if (numRidersBefore !== 0) {
      throw new Error("You must respond to the rider who first joined your queue.");
    }

    queueEntry.status = input.status as Status;

    if (input.status === Status.ACCEPTED) {
      ctx.user.queueSize = getQueueSize(ctx.user.queue.getItems());

      ctx.em.persist(ctx.user);
    }

    if (input.status === Status.DENIED || input.status === Status.COMPLETE) {
      pubSub.publish("Rider" + queueEntry.rider.id, null);

      ctx.user.queueSize = getQueueSize(ctx.user.queue.getItems());

      queueEntry.end = new Date();

      ctx.em.persist(ctx.user);
    }

    switch (queueEntry.status) {
      case Status.DENIED:
        sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} has denied your beep request 🚫`, "Open your app to find a diffrent beeper");
        break;
      case Status.ACCEPTED:
        sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} has accepted your beep request ✅`, "You will recieve another notification when they are on their way to pick you up");
        break;
      case Status.ON_THE_WAY:
        sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} is on their way 🚕`, `Your beeper is on their way in a ${ctx.user.cars[0]?.color} ${ctx.user.cars[0]?.make} ${ctx.user.cars[0]?.model}`);
        break;
      case Status.HERE:
        sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} is here 📍`, `Look for a ${ctx.user.cars[0]?.color} ${ctx.user.cars[0]?.make} ${ctx.user.cars[0]?.model}`);
        break;
      case Status.IN_PROGRESS:
        // Beep is in progress - no notification needed at this stage.
        break;
      case Status.COMPLETE:
        // Beep is complete.
        break;
      default:
        Sentry.captureException("Our beeper's state notification switch statement reached a point that is should not have");
    }

    const queueNew = ctx.user.queue.getItems().filter(beep => ![Status.COMPLETE, Status.CANCELED, Status.DENIED].includes(beep.status));

    await ctx.em.persistAndFlush(queueEntry);

    this.sendRiderUpdates(ctx.user, queueNew, pubSub);

    return queueNew;
  }

  private async sendRiderUpdates(beeper: User, queue: Beep[], pubSub: PubSubEngine) {
    pubSub.publish("Beeper" + beeper.id, queue);

    for (const entry of queue) {
      entry.position = getPositionInQueue(queue, entry);

      pubSub.publish("Rider" + entry.rider.id, entry);
    }
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async cancelBeep(@Ctx() ctx: Context, @Arg('id') id: string, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
    const entry = ctx.em.getReference(Beep, id);

    await ctx.em.populate(ctx.user, ['queue', 'queue.rider', 'cars'], { where: { cars: { default: true } }, filters: ['inProgress'], orderBy: { queue: { start: QueryOrder.ASC } } });

    const newQueue = ctx.user.queue.getItems().filter(entry => entry.id !== id);

    pubSub.publish("Beeper" + ctx.user.id, newQueue);

    for (const entry of ctx.user.queue) {
      if (entry.id === id) {
        sendNotification(entry.rider.pushToken, "Beep Canceled 🚫", `Your beeper, ${ctx.user.name()}, has canceled the beep`);
        pubSub.publish("Rider" + entry.rider.id, null);
      }
      else {
        entry.position = getPositionInQueue(newQueue, entry);
        pubSub.publish("Rider" + entry.rider.id, entry);
      }
    }

    entry.status = Status.CANCELED
    entry.end = new Date();

    ctx.user.queueSize = getQueueSize(ctx.user.queue.getItems());

    await ctx.em.persistAndFlush(ctx.user);

    return true;
  }

  @Subscription(() => [Beep], {
    topics: ({ args }) => "Beeper" + args.id,
  })
  @Authorized('No Verification Self')
  public async getBeeperUpdates(@Arg("id") id: string, @Root() entry: Beep[]): Promise<Beep[]> {
    return entry;
  }
}
