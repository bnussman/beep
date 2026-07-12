import * as Sentry from "@sentry/bun";
import { eq, or } from "drizzle-orm";
import { db } from "../utils/db";
import { beep } from "../../drizzle/schema";
import { pubSub, User } from "../utils/pubsub";
import { sendNotification } from "../utils/notifications";
import { updateLiveActivity } from "../utils/live-activities";
import { OSRM_BASE_URL } from "../utils/constants";
import { osrm } from "@banksnussman/osrm";

type Beep = typeof beep.$inferSelect;

export const inProgressBeep = or(
  eq(beep.status, "waiting"),
  eq(beep.status, "accepted"),
  eq(beep.status, "on_the_way"),
  eq(beep.status, "here"),
  eq(beep.status, "in_progress"),
);

export const inProgressBeepNew = {
  OR: [
    { status: "waiting" as const },
    { status: "accepted" as const },
    { status: "on_the_way" as const },
    { status: "here" as const },
    { status: "in_progress" as const },
  ],
};

export const isAcceptedBeepNew = {
  OR: [
    { status: "accepted" as const },
    { status: "here" as const },
    { status: "in_progress" as const },
    { status: "on_the_way" as const },
  ],
};

export function getIsAcceptedBeep(beep: Beep) {
  return (
    beep.status === "accepted" ||
    beep.status === "here" ||
    beep.status === "in_progress" ||
    beep.status === "on_the_way"
  );
}

export function getIsInProgressBeep(beep: Beep) {
  return (
    beep.status === "waiting" ||
    beep.status === "accepted" ||
    beep.status === "here" ||
    beep.status === "in_progress" ||
    beep.status === "on_the_way"
  );
}

export function getQueueSize(queue: Beep[]) {
  return queue.filter(getIsAcceptedBeep).length;
}

export async function getBeeperQueue(beeperId: string) {
  return await db.query.beep.findMany({
    where: { AND: [inProgressBeepNew, { beeper_id: beeperId }] },
    orderBy: { start: "asc" },
    with: {
      beeper: { columns: { password: false, passwordType: false } },
      rider: { columns: { password: false, passwordType: false } },
    },
  });
}

export async function getRidersCurrentRide(userId: string) {
  const beep = await db.query.beep.findFirst({
    where: {
      AND: [inProgressBeepNew, { rider_id: userId }],
    },
    with: {
      beeper: true,
    },
  });

  if (!beep) {
    return null;
  }

  const queue = await getBeeperQueue(beep.beeper_id);

  return { ...beep, ...getDerivedRiderFields(beep, queue) };
}

export function getPositionInQueue(beep: Beep, queue: Beep[]) {
  return queue.filter((b) => getIsAcceptedBeep(b) && b.start < beep.start)
    .length;
}

export function getDerivedRiderFields(beep: Beep, queue: Beep[]) {
  return {
    position: getPositionInQueue(beep, queue),
    queue: queue.map((beep) => ({ status: beep.status })),
    index_in_queue: queue.findIndex((beep) => beep.id === beep.id),
    riders_waiting: queue.filter((beep) => !getIsAcceptedBeep(beep)).length,
  };
}

export async function sendBeepUpdateNotificationToRider(
  beep: Beep & ReturnType<typeof getDerivedRiderFields>,
  beeper: User,
) {
  switch (beep.status) {
    case "canceled": {
      if (beep.rider_live_activity_token) {
        updateLiveActivity(beep.rider_live_activity_token, {
          action: "end",
          name: "RiderActivity",
        });
      }

      const riderPushToken = await getUsersPushToken(beep.rider_id);

      if (riderPushToken) {
        sendNotification({
          to: riderPushToken,
          title: `${beeper.first} ${beeper.last} has canceled your beep`,
          body: "Open your app to find a new beep",
        });
      }
      break;
    }
    case "denied": {
      if (beep.rider_live_activity_token) {
        updateLiveActivity(beep.rider_live_activity_token, {
          action: "end",
          name: "RiderActivity",
        });
      }

      const riderPushToken = await getUsersPushToken(beep.rider_id);

      if (riderPushToken) {
        sendNotification({
          to: riderPushToken,
          title: `${beeper.first} ${beeper.last} has denied your beep`,
          body: "Open your app to find a different beeper",
        });
      }
      break;
    }
    case "accepted": {
      const alert = {
        title: `${beeper.first} ${beeper.last} has accepted your beep request`,
        body: "You will receive another notification when they are on their way to pick you up",
      };

      if (beep.rider_live_activity_token) {
        updateLiveActivity(beep.rider_live_activity_token, {
          action: "update",
          name: "RiderActivity",
          props: {
            positionInQueue: beep.position,
            name: beeper.first,
            status: beep.status,
          },
          alert,
        });
      } else {
        const riderPushToken = await getUsersPushToken(beep.rider_id);

        if (riderPushToken) {
          sendNotification({
            to: riderPushToken,
            ...alert,
          });
        }
      }
      break;
    }
    case "on_the_way": {
      const alert = {
        title: `${beeper.first} ${beeper.last} is on their way 🚕`,
        body: "Your beeper is on their way.",
      };

      const c = await db.query.car.findFirst({
        where: { user_id: beeper.id, default: true },
      });

      if (c) {
        alert.body = `Your beeper is on their way in a ${c.color} ${c.make} ${c.model}`;
      }

      if (beep.rider_live_activity_token) {
        updateLiveActivity(beep.rider_live_activity_token, {
          action: "update",
          alert,
          name: "RiderActivity",
          props: {
            car: c
              ? { make: c.make, model: c.model, color: c.color }
              : undefined,
            positionInQueue: beep.position,
            etaMinutes: undefined, // @todo
            name: beeper.first,
            status: beep.status,
          },
        });
      } else {
        const riderPushToken = await getUsersPushToken(beep.rider_id);

        if (riderPushToken) {
          sendNotification({
            to: riderPushToken,
            ...alert,
          });
        }
      }
      break;
    }
    case "here": {
      const alert = {
        title: `${beeper.first} ${beeper.last} is here`,
        body: "Your beeper is here to pick you up.",
      };
      const c = await db.query.car.findFirst({
        where: { user_id: beeper.id, default: true },
      });

      if (c) {
        alert.body = `Look for a ${c.color} ${c.make} ${c.model}`;
      }

      if (beep.rider_live_activity_token) {
        updateLiveActivity(beep.rider_live_activity_token, {
          action: "update",
          alert,
          name: "RiderActivity",
          props: {
            car: c
              ? { make: c.make, model: c.model, color: c.color }
              : undefined,
            positionInQueue: beep.position,
            name: beeper.first,
            status: beep.status,
          },
        });
      } else {
        const riderPushToken = await getUsersPushToken(beep.rider_id);

        if (riderPushToken) {
          sendNotification({
            to: riderPushToken,
            ...alert,
          });
        }
      }
      break;
    }
    case "in_progress":
      if (beep.rider_live_activity_token) {
        updateLiveActivity(beep.rider_live_activity_token, {
          action: "update",
          name: "RiderActivity",
          props: {
            positionInQueue: beep.position,
            name: beeper.first,
            status: beep.status,
          },
        });
      }
      break;
    case "complete": {
      if (beep.rider_live_activity_token) {
        updateLiveActivity(beep.rider_live_activity_token, {
          action: "end",
          name: "RiderActivity",
        });
      }

      const riderPushToken = await getUsersPushToken(beep.rider_id);

      if (riderPushToken) {
        sendNotification({
          to: riderPushToken,
          title: `Your beep with ${beeper.first} ${beeper.last} is complete 🎉`,
          body: "Please rate your beeper in the app.",
        });
      }
      break;
    }
    default:
      Sentry.captureException(
        "Our beeper's state notification switch statement reached a point that is should not have",
      );
  }
}

async function getUsersPushToken(userId: string) {
  const rider = await db.query.user.findFirst({
    columns: {
      pushToken: true,
    },
    where: { id: userId },
  });

  return rider?.pushToken ?? null;
}

export async function getBeepsCount() {
  return await db.$count(beep);
}

export async function getInProgressBeepsCount() {
  return await db.$count(beep, inProgressBeep);
}

export async function publishBeepsCount() {
  const count = await getBeepsCount();
  pubSub.publish("beepsCount", count);
}

export async function updateEta(beeperId: string, location: { latitude: number; longitude: number }) {
  const currentBeep = await db.query.beep.findFirst({
    where: { AND: [{ beeper_id: beeperId }, inProgressBeepNew] },
    orderBy: { start: 'asc' },
    with: {
      rider: { columns: { location: true } }
    }
  })

  // If the beeper does not have an in-progress beep, we don't need to update the ETA
  if (!currentBeep) return;

  // If the beep status isn't "on_the_way", don't do anything
  if (currentBeep.status !== 'on_the_way') {
    return;
  }

  // If the beep's eta has been updated within the last 30 seconds, we don't need to update it again
  if (currentBeep.eta_updated_at && (Date.now() - currentBeep.eta_updated_at.getTime()) < 30000) {
    return;
  }

  // If the rider doesn't have a location, we can't calculate an ETA
  // @todo we could fallback to using the pick up location
  if (!currentBeep.rider.location) {
    return;
  }

  const { data, error } = await osrm.GET(
    "/route/{version}/{profile}/{coordinates}",
    {
      baseUrl: OSRM_BASE_URL,
      params: {
        path: {
          profile: "driving",
          coordinates: `${location.longitude},${location.latitude};${currentBeep.rider.location.longitude},${currentBeep.rider.location.latitude}`,
          version: "v1",
        },
      },
    },
  );

  if (error) {
    return;
  }

  const route = data.routes[0];

  if (!route) {
    return;
  }

  const durationMs = route.duration * 1000;

  const eta = new Date(Date.now() + durationMs);

  await db.update(beep).set({ eta, eta_updated_at: new Date() }).where(eq(beep.id, currentBeep.id));
}

export async function getETA(locations: { latitude: number;  longitude: number }[]) {
  const { data, error } = await osrm.GET(
    "/route/{version}/{profile}/{coordinates}",
    {
      baseUrl: OSRM_BASE_URL,
      params: {
        path: {
          profile: "driving",
          coordinates: locations.map((location) => `${location.longitude},${location.latitude}`).join(';'),
          version: "v1",
        },
      },
    },
  );

  if (error) {
    return null;
  }

  const route = data.routes[0];

  if (!route) {
    return null;
  }

  const durationMs = route.duration * 1000;

  return new Date(Date.now() + durationMs);
}
