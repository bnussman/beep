import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { inProgressBeep } from "./beep";
import { and, asc, eq } from "drizzle-orm";
import { beep, car } from "../../drizzle/schema";
import { observable } from "@trpc/server/observable";
import { redisSubscriber } from "../utils/redis";
import { TRPCError } from "@trpc/server";

export const beeperRouter = router({
  queue: authedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return getBeeperQueue(input);
    }),
  watchQueue: authedProcedure
    .input(z.string())
    .subscription(({ ctx, input }) => {
    // return an `observable` with a callback which is triggered immediately
    return observable<Awaited<ReturnType<typeof getBeeperQueue>>>((emit) => {
      const onUserUpdate = (message: string) => {
        // emit data to client
        emit.next(JSON.parse(message));
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      const listener = (message: string) => onUserUpdate(message);
      redisSubscriber.subscribe(`beeper-${input}`, listener);
      (async () => {
        const ride = await getBeeperQueue(input);
        emit.next(ride);
      })();
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        redisSubscriber.unsubscribe(`beeper-${input}`, listener);
      };
    });
  }),
  updateBeep: authedProcedure
    .input(
      z.object({
        beepId: z.string(),
        data: z.object({
          status: z.enum([ "canceled", "denied", "waiting", "accepted", "on_the_way", "here", "in_progress", "complete", ])
        })
      })
    )
    .mutation(async ({ input, ctx }) => {
      const queue = await getBeeperQueue(ctx.user.id);

      const queueEntry = queue.find((entry) => entry.id === input.beepId);

      if (!queueEntry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Can't find that beep."
        });
      }

      const isAcceptingOrDenying =
        input.data.status === "accepted" || input.data.status === "denied";

      const numRidersBefore =
        isAcceptingOrDenying ?
          queue.filter((entry) => entry.start < queueEntry.start && entry.status === "waiting").length :
          queue.filter((entry) => entry.start < queueEntry.start && entry.status !== "waiting").length;

      if (numRidersBefore !== 0) {
        throw new GraphQLError("You must respond to the rider who first joined your queue.");
      }

      queueEntry.status = input.status as Status;

      if (input.status === Status.ACCEPTED) {
        ctx.user.queueSize = getQueueSize(ctx.user.queue.getItems());

        ctx.em.persist(ctx.user);
      }

      if (input.status === Status.DENIED || input.status === Status.COMPLETE) {
        pubSub.publish("currentRide", queueEntry.rider.id, null);

        ctx.user.queueSize = getQueueSize(ctx.user.queue.getItems());

        queueEntry.end = new Date();

        ctx.em.persist(ctx.user);
      }

      switch (queueEntry.status) {
        case Status.DENIED:
          sendNotification({
            token: queueEntry.rider.pushToken,
            title: `${ctx.user.name()} has denied your beep request 🚫`,
            message: "Open your app to find a diffrent beeper"
          });
          break;
        case Status.ACCEPTED:
          sendNotification({
            token: queueEntry.rider.pushToken,
            title: `${ctx.user.name()} has accepted your beep request ✅`,
            message: "You will recieve another notification when they are on their way to pick you up"
          });
          break;
        case Status.ON_THE_WAY:
          sendNotification({
            token: queueEntry.rider.pushToken,
            title: `${ctx.user.name()} is on their way 🚕`,
            message: `Your beeper is on their way in a ${ctx.user.cars[0]?.color} ${ctx.user.cars[0]?.make} ${ctx.user.cars[0]?.model}`
          });
          break;
        case Status.HERE:
          sendNotification({
            token: queueEntry.rider.pushToken,
            title: `${ctx.user.name()} is here 📍`,
            message: `Look for a ${ctx.user.cars[0]?.color} ${ctx.user.cars[0]?.make} ${ctx.user.cars[0]?.model}`
          });
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

      this.sendRiderUpdates(ctx.user, queueNew);

      return queueNew;

    })
});


async function getBeeperQueue(beeperId: string) {
  const queue = await db.query.beep.findMany({
    where: and(
      inProgressBeep,
      eq(beep.beeper_id, beeperId)
    ),
    orderBy: asc(beep.start),
    with: {
      beeper: {
        columns: {
          id: true,
          first: true,
          last: true,
          photo: true,
          location: true,
          singlesRate: true,
          groupRate: true,
          capacity: true,
          phone: true,
          cashapp: true,
          venmo: true,
        },
        with: {
          cars: {
            where: eq(car.default, true),
            limit: 1,
          },
        }
      },
      rider: {
        columns: {
          id: true,
          first: true,
          last: true,
          venmo: true,
          cashapp: true,
          phone: true,
          photo: true,
          rating: true,
        },
      },
    }
  });

  return queue;
}
