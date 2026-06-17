import { RouterOutput, trpcClient } from "@/utils/trpc";
import RiderActivity from "@/live-activities/rider-activity";
import { getCurrentStatusMessage } from "@/utils/utils";
import { LiveActivity } from "expo-widgets";

const liveActivities = new Map<string, LiveActivity>();

export async function startLiveActivity(
  beep: RouterOutput["rider"]["startBeep"],
) {
  // end all previous rider live activies before starting a new one
  for (const [beepId, liveActivity] of liveActivities) {
    liveActivity.end("immediate");
  }

  const instance = RiderActivity.start({
    status: getCurrentStatusMessage(beep),
    name: `${beep.beeper.first} ${beep.beeper.last}`,
  });

  liveActivities.set(beep.id, instance);

  instance.addPushTokenListener(({ pushToken }) => {
    trpcClient.rider.setBeepLiveActivityToken
      .mutate({
        beepId: beep.id,
        token: pushToken,
      })
      .then(() => {
        alert(`Live Activity Token sent to the API ${pushToken} from listener`);
      });
  });
}
