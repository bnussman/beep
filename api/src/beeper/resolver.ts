import { sendNotification } from '../utils/notifications';
import { wrap } from '@mikro-orm/core';
import { BeepORM } from '../app';
import { Beep } from '../entities/Beep';
import { User } from '../entities/User';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { BeeperSettingsInput, UpdateQueueEntryInput } from '../validators/beeper';
import * as Sentry from '@sentry/node';

@Resolver(Beep)
export class BeeperResolver {

    @Mutation(() => Boolean)
    @Authorized()
    public async setBeeperStatus(@Ctx() ctx: Context, @Arg('input') input: BeeperSettingsInput): Promise<boolean> {
        if ((input.isBeeping == false) && (ctx.user.queueSize > 0)) {
            throw new Error("You can't stop beeping when you still have beeps to complete or riders in your queue");
        }

        wrap(ctx.user).assign(input);

        await BeepORM.userRepository.persistAndFlush(ctx.user);

        await BeepORM.em.populate(ctx.user, ['queue']);

        return true;
    }
    
    @Mutation(() => Boolean)
    public async setBeeperQueue(@Ctx() ctx: Context, @Arg('input') input: UpdateQueueEntryInput): Promise<boolean> {
        const queueEntry = await BeepORM.queueEntryRepository.findOneOrFail(input.queueId, { populate: true });

        if (input.value == 'accept' || input.value == 'deny') {
            const numRidersBefore = await BeepORM.queueEntryRepository.count({ timeEnteredQueue: { $lt: queueEntry.timeEnteredQueue }, isAccepted: false });

            if (numRidersBefore != 0) {
                throw new Error("You must respond to the rider who first joined your queue.");
            }
        }
        else {
            const numRidersBefore = await BeepORM.queueEntryRepository.count({ timeEnteredQueue: { $lt: queueEntry.timeEnteredQueue }, isAccepted: true });

            if (numRidersBefore != 0) {
                throw new Error("You must respond to the rider who first joined your queue.");
            }
        }

        if (input.value == 'accept') {
            queueEntry.isAccepted = true;

            ctx.user.queueSize++;

            sendNotification(queueEntry.rider, `${ctx.user.name} has accepted your beep request`, "You will recieve another notification when they are on their way to pick you up.");

            BeepORM.queueEntryRepository.persist(queueEntry);
            BeepORM.userRepository.persist(ctx.user);

            await BeepORM.em.flush();

            return true;
        }
        else if (input.value == 'deny' || input.value == 'complete') {
            const finishedBeep = new Beep();

            wrap(finishedBeep).assign(queueEntry, { em: BeepORM.em });

            finishedBeep.doneTime = Date.now();

            finishedBeep._id = queueEntry._id;
            finishedBeep.id = queueEntry.id;

            BeepORM.beepRepository.persist(finishedBeep);

            if (queueEntry.isAccepted) ctx.user.queueSize--;

            BeepORM.userRepository.persist(ctx.user);

            queueEntry.state = -1;

            BeepORM.queueEntryRepository.persist(queueEntry);

            await BeepORM.em.flush();

            if (input.value == "deny") {
                sendNotification(queueEntry.rider, `${ctx.user.name} has denied your beep request`, "Open your app to find a diffrent beeper.");
            }

            return true;
        }
        else {
            queueEntry.state++;

            switch(queueEntry.state) {
                case 1:
                    sendNotification(queueEntry.rider, `${ctx.user.name} is on their way!`, "Your beeper is on their way to pick you up.");
                break;
                case 2:
                    sendNotification(queueEntry.rider, `${ctx.user.name} is here!`, "Your beeper is here to pick you up.");
                break;
                case 3:
                    break;
                default: 
                    Sentry.captureException("Our beeper's state notification switch statement reached a point that is should not have");
            }

            await BeepORM.queueEntryRepository.persistAndFlush(queueEntry);

            return true;
        }
    }
}
