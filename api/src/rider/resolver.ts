import { sendNotification } from '../utils/notifications';
import { BeepORM } from '../app';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { QueueEntry } from '../entities/QueueEntry';
import { User } from '../entities/User';
import { Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import GetBeepInput from '../validators/rider';
import { Context } from '../utils/context';
import { Beep } from '../entities/Beep';
   
@Resolver()
export class RiderResolver {

    @Mutation(() => QueueEntry)
    @Authorized()
    public async chooseBeep(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('beeperId') beeperId: string, @Arg('input') input: GetBeepInput): Promise<QueueEntry> {
        const beeper = await BeepORM.userRepository.findOneOrFail(beeperId, { populate: ['queue'], refresh: true });

        if (!beeper.isBeeping) {
            throw new Error("The user you have chosen is no longer beeping at this time.");
        }

        const entry = {
            start: Math.floor(Date.now() / 1000),
            isAccepted: false,
            groupSize: input.groupSize,
            origin: input.origin,
            destination: input.destination,
            state: 0,
            rider: ctx.user,
            beeper: beeper
        };

        const q = new QueueEntry();

        wrap(q).assign(entry, { em: BeepORM.em });

        beeper.queue.add(q);

        sendNotification(beeper.pushToken, `${ctx.user.name()} has entered your queue`, "Please open your app to accept or deny this rider.", "enteredBeeperQueue");

        q.ridersQueuePosition = -1;

        pubSub.publish("Beeper" + beeper.id, beeper.queue.get());

        q.beeper.location = undefined;
        
        pubSub.publish("Rider" + ctx.user.id, q);

        console.log(q);

        await BeepORM.userRepository.persistAndFlush(beeper);

        return q;
    }
   
    @Query(() => User)
    @Authorized()
    public async findBeep(): Promise<User> {
        const beeper = await BeepORM.userRepository.findOne({ isBeeping: true });

        if (!beeper) {
            throw new Error("Nobody is beeping right now!");
        }

        return beeper;
    }

    @Query(() => QueueEntry, { nullable: true })
    @Authorized()
    public async getRiderStatus(@Ctx() ctx: Context): Promise<QueueEntry | null> {
        const entry = await BeepORM.queueEntryRepository.findOne({ rider: ctx.user }, { populate: ['beeper', 'beeper.location'], refresh: true });

        if (!entry) {
            return null;
        }

        entry.ridersQueuePosition = await BeepORM.queueEntryRepository.count({ beeper: entry.beeper, start: { $lt: entry.start } });

        if (entry.state != 1) {
            entry.location = undefined;
        }

        console.log(entry.beeper.location);

        return entry;
    }
    
    @Mutation(() => Boolean)
    @Authorized()
    public async riderLeaveQueue(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const entry = await BeepORM.queueEntryRepository.findOne({ rider: ctx.user }, ['beeper']);

        if (!entry) {
            throw new Error("Unable to leave queue");
        }

        if (entry.isAccepted) entry.beeper.queueSize--;
        
        const id = entry.beeper.id;

        await BeepORM.queueEntryRepository.removeAndFlush(entry);
        
        this.sendBeeperUpdate(id, pubSub);
        pubSub.publish("Rider" + ctx.user.id, null);

        sendNotification(entry.beeper.pushToken, `${ctx.user.name()} left your queue`, "They decided they did not want a beep from you! :(");

        await BeepORM.userRepository.persistAndFlush(entry.beeper);

        return true;
    }

    private async sendBeeperUpdate(id: string, pubSub: PubSubEngine) {
        const queue = await BeepORM.queueEntryRepository.find({ beeper: id }, { orderBy: { start: QueryOrder.ASC }, refresh: true });

        pubSub.publish("Beeper" + id, queue);
    }
    
    @Query(() => [User])
    @Authorized()
    public async getBeeperList(): Promise<User[]> {
        return await BeepORM.userRepository.find({ isBeeping: true });
    }

    @Query(() => Beep, { nullable: true })
    @Authorized()
    public async getLastBeepToRate(@Ctx() ctx: Context): Promise<Beep | null> {
        const beep = await BeepORM.beepRepository.findOne({ rider: ctx.user.id }, ['beeper'], { end: QueryOrder.DESC });

        if (!beep) return null;

        const count = await BeepORM.ratingRepository.count({ rater: ctx.user.id, rated: beep.beeper.id, timestamp: { $gte: beep.end} });

        if (count > 0) {
            return null;
        }

        return beep;
    }

    @Subscription(() => QueueEntry, {
        nullable: true,
        topics: ({ args }) => "Rider" + args.topic,
    })
    public getRiderUpdates(@Arg("topic") topic: string, @Root() entry: QueueEntry): QueueEntry | null {
        return entry;
    }
}
