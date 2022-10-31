import * as Notifications from "expo-notifications";
import { Vibration } from "react-native";
import { client } from "../utils/Apollo";
import { isMobile } from "./constants";
import { EditAccount } from "../routes/settings/EditProfile";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Checks for permssion for Notifications, asks expo for push token, sets up notification listeners, returns
 * push token to be used
 */
export async function getPushToken(): Promise<string | null> {
  const hasPermission = await getNotificationPermission();

  if (!hasPermission) {
    return null;
  }

  const pushToken = await Notifications.getExpoPushTokenAsync();

  return pushToken.data;
}

/**
 * function to get existing or prompt for notification permission
 * @returns boolean true if client has location permissions
 */
async function getNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });

  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function updatePushToken(): Promise<void> {
  if (isMobile) {
    const token = await getPushToken();

    if (token) {
      await client.mutate({
        mutation: EditAccount,
        variables: { input: { pushToken: token } },
      });
    }
  }
}

export function handleNotification(
  notification: Notifications.Notification
): void {
  // Vibration.vibrate();
}
