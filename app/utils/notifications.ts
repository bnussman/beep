import * as Notifications from "expo-notifications";
import { isMobile } from "./constants";
import { Logger } from "./logger";
import { basicTrpcClient } from "./trpc";

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

  try {
    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId: "2c7a6adb-2579-43f1-962e-b23c7e541ec4"
    });

    return pushToken.data;
  } catch(error) {
    Logger.error(error);

    return null;
  }
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

export async function updatePushToken(currentPushToken: string | null): Promise<void> {
  if (isMobile) {
    const token = await getPushToken();
    if (token && token !== currentPushToken) {
      try {
        await basicTrpcClient.user.edit.mutate({ pushToken: token });
      } catch (error) {
        alert(error);
        Logger.error(error);
      }
    }
  }
}
