import * as Sentry from "@sentry/bun";

export interface PushNotification {
  to: string | string[];
  title: string;
  body: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface SendNotificationOptions {
  token: string | null;
  title: string;
  message: string;
  categoryId?: 'newbeep';
  data?: Record<string, string>;
}

export async function sendNotification(options: SendNotificationOptions): Promise<void> {
  if (!options.token) {
    return;
  }

  try {
    await fetch('https://api.expo.dev/v2/push/send', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: options.token,
        title: options.title,
        body: options.message,
        sound: 'default',
        _displayInForeground: true,
        categoryId: options.categoryId,
        data: options.data,
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
    await fetch('https://api.expo.dev/v2/push/send', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications)
    });
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
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
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
