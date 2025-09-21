import * as Notifications from "expo-notifications";
import { isMobile, isWeb } from "./constants";
import { Logger } from "./logger";
import { basicTrpcClient } from "./trpc";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
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
      projectId: "2c7a6adb-2579-43f1-962e-b23c7e541ec4",
    });

    return pushToken.data;
  } catch (error) {
    console.log("error", error);
    Logger.error(error);

    return null;
  }
}

/**
 * function to get existing or prompt for notification permission
 * @returns boolean true if client has location permissions
 */
async function getNotificationPermission(): Promise<boolean> {
  let permission = await Notifications.getPermissionsAsync();

  if (!isNotificationPermissionGranted(permission)) {
    // if we don't have permission, request it
    permission = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
  }

  return isNotificationPermissionGranted(permission);
}

function isNotificationPermissionGranted(
  permissionStatus: Notifications.NotificationPermissionsStatus,
) {
  return (
    permissionStatus.granted ||
    permissionStatus.ios?.status ===
      Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function updatePushToken(
  currentPushToken: string | null,
): Promise<void> {
  if (isMobile) {
    const token = await getPushToken();
    console.log("token", token);
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

export function setupNotifications() {
  if (!isWeb) {
    Notifications.setNotificationCategoryAsync(
      "newbeep",
      [
        {
          identifier: "accept",
          buttonTitle: "Accept",
          options: {
            opensAppToForeground: false,
          },
        },
        {
          identifier: "deny",
          buttonTitle: "Deny",
          options: {
            isDestructive: true,
            opensAppToForeground: false,
          },
        },
      ],
      {
        allowInCarPlay: true,
        allowAnnouncement: true,
      },
    );
  }

  Notifications.addNotificationResponseReceivedListener((response) => {
    console.log(response.actionIdentifier);
    if (
      response.notification.request.content.categoryIdentifier === "newbeep" &&
      response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      basicTrpcClient.beeper.updateBeep.mutate({
        beepId: response.notification.request.content.data.id as string,
        data: {
          status:
            response.actionIdentifier === "accept" ? "accepted" : "denied",
        },
      });
    }
  });
}
