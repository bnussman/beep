import { sendNotification } from '../utils/notifications';
import { EntityManager, QueryOrder, wrap } from '@mikro-orm/core';
import { QueueEntry } from '../entities/QueueEntry';
import { User } from '../entities/User';
import { Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import GetBeepInput from '../validators/rider';
import { Context } from '../utils/context';
import { Beep } from '../entities/Beep';
import { Rating } from '../entities/Rating';
   
@Resolver()
export class RiderResolver {

    @Mutation(() => QueueEntry)
    @Authorized()
    public async chooseBeep(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('beeperId') beeperId: string, @Arg('input') input: GetBeepInput): Promise<QueueEntry> {
        const beeper = await ctx.em.findOneOrFail(User, beeperId, { populate: ['queue', 'location', 'queue.rider'], refresh: true });

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

        wrap(q).assign(entry, { em: ctx.em });

        beeper.queue.add(q);

        sendNotification(beeper.pushToken, `${ctx.user.name()} has entered your queue`, "Please open your app to accept or deny this rider.", "enteredBeeperQueue");

        q.ridersQueuePosition = -1;

        pubSub.publish("Beeper" + beeper.id, beeper.queue.get());
        pubSub.publish("Rider" + ctx.user.id, q);

        await ctx.em.persistAndFlush(beeper);

        return q;
    }
   
    @Query(() => User)
    @Authorized()
    public async findBeep(@Ctx() ctx: Context): Promise<User> {
        const beeper = await ctx.em.findOne(User, { isBeeping: true });

        if (!beeper) {
            throw new Error("Nobody is beeping right now!");
        }

        return beeper;
    }

    @Query(() => QueueEntry, { nullable: true })
    @Authorized()
    public async getRiderStatus(@Ctx() ctx: Context): Promise<QueueEntry | null> {
        // @TODO this is causing too many queries to the DB :(
        const entry = await ctx.em.findOne(QueueEntry, { rider: ctx.user }, { populate: ['beeper', 'beeper.queue', 'beeper.location'], refresh: true });

        if (!entry) {
            return null;
        }

        entry.ridersQueuePosition = entry.beeper.queue.getItems().filter((entry: QueueEntry) => entry.start < entry.start).length;

        return entry;
    }
    
    @Mutation(() => Boolean)
    @Authorized()
    public async riderLeaveQueue(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const entry = await ctx.em.findOne(QueueEntry, { rider: ctx.user }, ['beeper']);

        if (!entry) {
            throw new Error("Unable to leave queue");
        }

        if (entry.isAccepted) entry.beeper.queueSize--;
        
        sendNotification(entry.beeper.pushToken, `${ctx.user.name()} left your queue`, "They decided they did not want a beep from you! :(");

        const id = entry.beeper.id;
        
        ctx.em.persist(entry.beeper);

        pubSub.publish("Rider" + ctx.user.id, null);

        await ctx.em.removeAndFlush(entry);

        this.sendBeeperUpdate(id, pubSub, ctx.em);

        return true;
    }

    private async sendBeeperUpdate(id: string, pubSub: PubSubEngine, em: EntityManager) {
        const queue = await em.find(QueueEntry, { beeper: id }, { orderBy: { start: QueryOrder.ASC }, populate: ['rider'] });

        pubSub.publish("Beeper" + id, queue);
    }
    
    @Query(() => [User])
    @Authorized()
    public async getBeeperList(@Ctx() ctx: Context): Promise<User[]> {
        return await ctx.em.find(User, { isBeeping: true }, { refresh: true });
    }

    @Query(() => Beep, { nullable: true })
    @Authorized()
    public async getLastBeepToRate(@Ctx() ctx: Context): Promise<Beep | null> {
        const beep = await ctx.em.findOne(Beep, { rider: ctx.user.id }, ['beeper'], { end: QueryOrder.DESC });

        if (!beep) return null;

        const count = await ctx.em.count(Rating, { rater: ctx.user.id, rated: beep.beeper.id, timestamp: { $gte: beep.end} });

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
