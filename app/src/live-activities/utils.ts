import RiderActivity from "@/live-activities/rider-activity";
import { trpcClient } from "@/utils/trpc";

export function setupLiveActivityListeners() {
  const activities = RiderActivity.getInstances();

  for (const activity of activities) {
    activity.addPushTokenListener((event) => {
      trpcClient.rider.updateLiveActivityToken.mutate({
        activityId: event.activityId,
        token: event.pushToken,
      });
    });
  }
}
