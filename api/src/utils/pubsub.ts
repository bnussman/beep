import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "..";
import { getBeeperQueue } from "../routers/beeper";
import { getRidersCurrentRide } from "../routers/rider";
import { redis } from "./redis";
import { Context } from "./trpc";

type RouterOutput = inferRouterOutputs<AppRouter>;

export const pubSub = {
  publishRiderUpdate(userId: string, beep: Awaited<ReturnType<typeof getRidersCurrentRide>>) {
    redis.publish(`rider-${userId}`, JSON.stringify(beep));
  },
  publishBeeperQueue(userId: string, queue: Awaited<ReturnType<typeof getBeeperQueue>>) {
    redis.publish(`beeper-${userId}`, JSON.stringify(queue));
  },
  publishUserUpdate(userId: string, user: NonNullable<Context['user']>) {
    redis.publish(`user-${userId}`, JSON.stringify(user));
  },
};
