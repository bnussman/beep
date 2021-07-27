import { request } from "https";

export interface PushNotification {
  to: string | undefined;
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

  const req = request({
    host: "exp.host",
    path: "/--/api/v2/push/send",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  req.write(
    JSON.stringify({
      to: token,
      title: title,
      body: message,
    })
  );

  req.end();
}

/**
 * Use Expo's API to send many push notifications
 */
export async function sendNotifications(notifications: PushNotification[]): Promise<void> {
  const req = request({
    host: "exp.host",
    path: "/--/api/v2/push/send",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  req.write(JSON.stringify(notifications));

  req.end();
}
