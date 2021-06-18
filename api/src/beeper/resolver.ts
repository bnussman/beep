import { sendNotification } from '../utils/notifications';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { BeepORM } from '../app';
import { Beep } from '../entities/Beep';
import { Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Resolver, Root, Subscription } from 'type-graphql';
import { Context } from '../utils/context';
import { BeeperSettingsInput, UpdateQueueEntryInput } from '../validators/beeper';
import * as Sentry from '@sentry/node';
import { QueueEntry } from '../entities/QueueEntry';

@Resolver(Beep)
export class BeeperResolver {

    @Mutation(() => Boolean)
    @Authorized()
    public async setBeeperStatus(@Ctx() ctx: Context, @Arg('input') input: BeeperSettingsInput, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        await BeepORM.userRepository.populate(ctx.user, 'queue');

        if (!input.isBeeping && (ctx.user.queue.length > 0)) {
            throw new Error("You can't stop beeping when you still have beeps to complete or riders in your queue");
        }

        wrap(ctx.user).assign(input);

        pubSub.publish("User" + ctx.user.id, ctx.user);

        await BeepORM.userRepository.persistAndFlush(ctx.user);

        return true;
    }
    
    @Mutation(() => Boolean)
    @Authorized()
    public async setBeeperQueue(@Ctx() ctx: Context, @PubSub() pubSub: PubSubEngine, @Arg('input') input: UpdateQueueEntryInput): Promise<boolean> {
        const queueEntry = await BeepORM.queueEntryRepository.findOneOrFail(input.queueId, { populate: ["rider", "beeper"], refresh: true });

        if (input.value == 'accept' || input.value == 'deny') {
            const numRidersBefore = await BeepORM.queueEntryRepository.count({ start: { $lt: queueEntry.start }, isAccepted: false });

            if (numRidersBefore != 0) {
                throw new Error("You must respond to the rider who first joined your queue.");
            }
        }
        else {
            const numRidersBefore = await BeepORM.queueEntryRepository.count({ start: { $lt: queueEntry.start }, isAccepted: true });

            if (numRidersBefore != 0) {
                throw new Error("You must respond to the rider who first joined your queue.");
            }
        }

        if (input.value == 'accept') {
            queueEntry.isAccepted = true;

            ctx.user.queueSize++;

            sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} has accepted your beep request`, "You will recieve another notification when they are on their way to pick you up.");

            await BeepORM.queueEntryRepository.persistAndFlush(queueEntry);
            await BeepORM.userRepository.persistAndFlush(ctx.user);
        }
        else if (input.value == 'deny' || input.value == 'complete') {
            pubSub.publish("Rider" + queueEntry.rider.id, null);

            if (input.value == 'complete') {
                const beep = new Beep(queueEntry);

                await BeepORM.beepRepository.persistAndFlush(beep);
            }

            if (queueEntry.isAccepted && ctx.user.queueSize > 0) ctx.user.queueSize--;

            await BeepORM.userRepository.persistAndFlush(ctx.user);

            await BeepORM.queueEntryRepository.removeAndFlush(queueEntry);

            if (input.value == "deny") {
                sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} has denied your beep request`, "Open your app to find a diffrent beeper.");
            }
        }
        else {
            queueEntry.state++;

            switch(queueEntry.state) {
                case 1:
                    sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} is on their way!`, "Your beeper is on their way to pick you up.");
                break;
                case 2:
                    sendNotification(queueEntry.rider.pushToken, `${ctx.user.name()} is here!`, "Your beeper is here to pick you up.");
                break;
                case 3:
                    break;
                default: 
                    Sentry.captureException("Our beeper's state notification switch statement reached a point that is should not have");
            }

            await BeepORM.queueEntryRepository.persistAndFlush(queueEntry);
        }


        this.sendRiderUpdates(ctx.user.id, pubSub);

        return true;
    }

    private async sendRiderUpdates(beeperId: string, pubSub: PubSubEngine) {
        const queues = await BeepORM.queueEntryRepository.find({ beeper: beeperId }, { orderBy: { start: QueryOrder.ASC }, refresh: true, populate: ['beeper.location'] });

        pubSub.publish("Beeper" + beeperId, queues);

        for (const entry of queues) {
            entry.ridersQueuePosition = await BeepORM.queueEntryRepository.count({ beeper: beeperId, start: { $lt: entry.start } });

            pubSub.publish("Rider" + entry.rider.id, entry);
        }
    }

    @Mutation(() => Boolean)
    @Authorized()
    public async cancelBeep(@Ctx() ctx: Context, @Arg('id') id: string, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const entry = BeepORM.queueEntryRepository.getReference(id);

        await ctx.user.queue.init({ orderBy: { start: QueryOrder.ASC }, populate: ['rider', 'beeper', 'beeper.location'] });

        pubSub.publish("Beeper" + ctx.user.id, ctx.user.queue.getItems().filter(entry => entry.id != id));

        for (const entry of ctx.user.queue) {
            if (entry.id == id) {
                sendNotification(entry.rider.pushToken, "Beep Canceled", `Your beeper, ${ctx.user.name()}, has canceled the beep`);
                pubSub.publish("Rider" + entry.rider.id, null);
            }
            else {
                entry.ridersQueuePosition = await BeepORM.queueEntryRepository.count({ beeper: ctx.user, start: { $lt: entry.start } });

                pubSub.publish("Rider" + entry.rider.id, entry);
            }
        }

        BeepORM.queueEntryRepository.removeAndFlush(entry);

        ctx.user.queueSize--;

        BeepORM.userRepository.persistAndFlush(ctx.user);

        return true;
    }

    @Subscription(() => [QueueEntry], {
        topics: ({ args }) => "Beeper" + args.topic,
    })
    public async getBeeperUpdates(@Arg("topic") topic: string, @Root() entry: QueueEntry[]): Promise<QueueEntry[]> {
        return entry;
    }
}
