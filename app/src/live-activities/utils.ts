import RiderActivity from "@/live-activities/rider-activity";
import { isIOS } from "@/utils/constants";
import { RouterOutput, trpcClient } from "@/utils/trpc";

const riderLiveActivities = RiderActivity.getInstances();
const riderLiveActivityListeners: { remove(): void }[] = [];

export function setupLiveActivityListeners() {
  for (const activity of riderLiveActivities) {
    const listener = activity.addPushTokenListener((event) => {
      trpcClient.rider.updateLiveActivityToken
        .mutate({
          activityId: event.activityId,
          token: event.pushToken,
        })
        .then(() => alert(`Sent token for activity id ${event.activityId}`));
    });
    alert("Listener has been setup");
    riderLiveActivityListeners.push(listener);
  }
}

export function startBeepLiveActivity(
  beep: RouterOutput["rider"]["startBeep"],
) {
  const riderActivity = RiderActivity.start({
    status: beep.status,
    name: beep.beeper.first,
    car: undefined,
    positionInQueue: beep.position,
  });

  riderLiveActivities.push(riderActivity);

  const listener = riderActivity.addPushTokenListener((event) => {
    trpcClient.rider.setBeepLiveActivityToken
      .mutate({
        activityId: event.activityId,
        beepId: beep.id,
        token: event.pushToken,
      })
      .then(() => {
        alert(
          `Beep live activity started. Activity ID ${event.activityId} | Beep ID ${beep.id}`,
        );
      });
  });

  riderLiveActivityListeners.push(listener);
}

export function endRiderLiveActivities() {
  if (isIOS) {
    for (const listener of riderLiveActivityListeners) {
      listener.remove();
    }

    for (const activity of riderLiveActivities) {
      activity.end("immediate");
    }
  }
}
