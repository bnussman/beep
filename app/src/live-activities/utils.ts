import RiderActivity from "@/live-activities/rider-activity";
import { isIOS } from "@/utils/constants";
import { orpcClient } from "@/utils/orpc";
import { RouterOutputs } from "../../../api/src";

const riderLiveActivities = RiderActivity.getInstances();
const riderLiveActivityListeners: { remove(): void }[] = [];

export function setupLiveActivityListeners() {
  for (const activity of riderLiveActivities) {
    const listener = activity.addPushTokenListener((event) => {
      orpcClient.rider.updateLiveActivityToken({
        activityId: event.activityId,
        token: event.pushToken,
      });
    });
    riderLiveActivityListeners.push(listener);
  }
}

export function startBeepLiveActivity(
  beep: RouterOutputs["rider"]["startBeep"],
) {
  const riderActivity = RiderActivity.start({
    status: beep.status,
    name: beep.beeper.first,
    car: undefined,
    positionInQueue: beep.position,
  });

  riderLiveActivities.push(riderActivity);

  const listener = riderActivity.addPushTokenListener((event) => {
    orpcClient.rider.setBeepLiveActivityToken({
      activityId: event.activityId,
      beepId: beep.id,
      token: event.pushToken,
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
