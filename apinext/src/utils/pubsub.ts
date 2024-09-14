import { getBeeperQueue } from "../routers/beeper";
import { getRidersCurrentRide } from "../routers/rider";
import { redis } from "./redis";

export const pubSub = {
  publishRiderUpdate(userId: string, beep: Awaited<ReturnType<typeof getRidersCurrentRide>>) {
    redis.publish(`rider-${userId}`, JSON.stringify(beep));
  },
  publishBeeperQueue(userId: string, queue: Awaited<ReturnType<typeof getBeeperQueue>>) {
    redis.publish(`beeper-${userId}`, JSON.stringify(queue));
  },
};
