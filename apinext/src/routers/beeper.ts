import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { inProgressBeep } from "./beep";
import { and, eq } from "drizzle-orm";
import { beep } from "../../drizzle/schema";
import { observable } from "@trpc/server/observable";
import { redisSubscriber } from "../utils/redis";

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
});


async function getBeeperQueue(beeperId: string) {
  const queue = await db.query.beep.findMany({
    where: and(
      inProgressBeep,
      eq(beep.beeper_id, beeperId)
    ),
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
          cars: true,
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
