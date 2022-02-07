import got from "got";

export interface PushNotification {
  to: string;
  title: string;
  body: string;
}

/**
 * Use Expo's API to send a push notification
 * @param user the resipiant's id
 * @param title for the notification
 * @param message is the body of the push notification
 */
export async function sendNotification(token: string | undefined, title: string, message: string): Promise<void> {

  if (!token) return;

  await got.post('https://api.expo.dev/v2/push/send', {
    json: {
      to: token,
      title: title,
      body: message,
    }
  });
}

/**
 * Use Expo's API to send many push notifications
 */
export async function sendNotifications(notifications: PushNotification[]): Promise<void> {
  await got.post('https://api.expo.dev/v2/push/send', { json: notifications });
}
