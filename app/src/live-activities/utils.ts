import { RouterOutput, trpcClient } from "@/utils/trpc";
import { getCurrentStatusMessage } from "@/utils/utils";
import { LiveActivity, PushTokenEvent } from "expo-widgets";
import RiderActivity, {
  RiderActivityProps,
} from "@/live-activities/rider-activity";

type Beep = RouterOutput["rider"]["startBeep"];

let riderActivity: LiveActivity<RiderActivityProps> | null =
  RiderActivity.getInstances()[0] ?? null;
let riderActivityTokenListener: { remove(): void } | null = null;

async function handleRiderPushTokenUpdate(event: PushTokenEvent, beep: Beep) {
  trpcClient.rider.setBeepLiveActivityToken
    .mutate({
      beepId: beep.id,
      token: event.pushToken,
    })
    .then(() => {
      alert(
        `Live Activity Token sent to the API ${event.pushToken} from listener`,
      );
    });
}

export async function ensureRiderLiveActivity(beep: Beep | null | undefined) {
  if (beep === undefined) {
    return;
  }

  // If the user is not in a beep, ensure there is no live activity and listener
  if (beep === null) {
    if (riderActivityTokenListener) {
      riderActivityTokenListener.remove();
      riderActivityTokenListener = null;
    }
    if (riderActivity) {
      riderActivity.end("immediate");
      riderActivity = null;
    }
    return;
  }

  if (riderActivity && !riderActivityTokenListener) {
    // If there is an active live activity, but a listener is not setup, setup one.
    // This is so that we continue listening for tokens after the app is killed and re-opened.
    riderActivityTokenListener = riderActivity.addPushTokenListener((event) =>
      handleRiderPushTokenUpdate(event, beep),
    );
    return;
  }

  if (riderActivity && riderActivityTokenListener) {
    return;
  }

  // User is in a beep. Start a live activity and listen for token updates
  riderActivity = RiderActivity.start({
    status: getCurrentStatusMessage(beep),
    name: `${beep.beeper.first} ${beep.beeper.last}`,
  });

  riderActivityTokenListener = riderActivity.addPushTokenListener((event) =>
    handleRiderPushTokenUpdate(event, beep),
  );
}
