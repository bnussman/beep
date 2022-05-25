import * as Notifications from "expo-notifications";
import { Vibration } from "react-native";
import { gql } from "@apollo/client";
import { client } from "../utils/Apollo";
import { isMobile } from "./constants";
import { Toast } from "native-base";

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

  Notifications.addNotificationReceivedListener(handleNotification);

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

/**
 * call getPushToken and send to backend
 * @param token a user's auth token
 */
export async function updatePushToken(
  previousPushToken?: string | null
): Promise<void> {
  if (isMobile) {
    const UpdatePushToken = gql`
      mutation UpdatePushToken($token: String!) {
        updatePushToken(pushToken: $token)
      }
    `;

    const token = await getPushToken();

    if (previousPushToken && token === previousPushToken) {
      return;
    }

    if (token) {
      await client.mutate({ mutation: UpdatePushToken, variables: { token } });
    }
  }
}

function handleNotification(notification: Notifications.Notification): void {
  // @TODO toast if we ever can
  Vibration.vibrate();
  Toast.show({
    title: notification.request.content.title,
    description: notification.request.content.body,
  });
}
