import * as Sentry from "@sentry/node";

export interface PushNotification {
  to: string | string[];
  title: string;
  body: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Use Expo's API to send a push notification
 * 
 * @param {string} token the Expo Push Token of the user
 * @param {string} title for the notification
 * @param {string} message is the body of the push notification
 */
export async function sendNotification(token: string | null, title: string, message: string): Promise<void> {
  if (!token) return;

  try {
    await fetch('https://api.expo.dev/v2/push/send', {
      method: "POST",
      body: JSON.stringify({
        to: token,
        title: title,
        body: message,
        sound: 'default',
        _displayInForeground: true
      })
    });
  } catch (error) {
    Sentry.captureException(error);
  }
}

/**
 * Use Expo's API to send many push notifications
 * 
 * @param {PushNotification[]} notifications an array of Expo Notifications
 */
export async function sendNotifications(notifications: PushNotification[]): Promise<void> {
  try {
    await fetch('https://api.expo.dev/v2/push/send', { method: "POST", body: JSON.stringify(notifications) });
  } catch (error) {
    Sentry.captureException(error);
  }
}

export async function sendNotificationsNew(to: string[], title: string, body: string): Promise<void> {
  const batches = chunkArrayInGroups(to, 100);

  for (const batch of batches) {
    try {
      await fetch('https://api.expo.dev/v2/push/send', {
        method: "POST",
        body: JSON.stringify({
          to: batch,
          title,
          body,
          sound: 'default',
          _displayInForeground: true
        })
      });
    } catch (error) {
      Sentry.captureException(error);
    }

    await sleep(3000);
  }
}

function chunkArrayInGroups<T>(arr: T[], size: number) {
  const myArray = [];
  for(let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}
