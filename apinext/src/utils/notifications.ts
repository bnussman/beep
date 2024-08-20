import * as Sentry from '@sentry/bun';

export interface PushNotification {
  to: string;
  title: string;
  body: string;
  categoryId?: 'newbeep';
  data?: Record<string, string>;
}

const DEFAULT_NOTIFICATION_OPTIONS = {
  sound: 'default',
  _displayInForeground: true,
};

export async function sendNotification(notification: PushNotification) {
  await sendNotifications([notification])
}

export async function sendNotifications(notifications: PushNotification[]): Promise<void> {
  try {
    await fetch('https://api.expo.dev/v2/push/send', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications.map(n => ({ ...n, ...DEFAULT_NOTIFICATION_OPTIONS })))
    });
  } catch (error) {
    Sentry.captureException(error);
  }
}

export async function sendNotificationsBatch(to: string[], title: string, body: string): Promise<void> {
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
          ...DEFAULT_NOTIFICATION_OPTIONS
        })
      });
    } catch (error) {
      Sentry.captureException(error);
    }

    await Bun.sleep(3000);
  }
}

function chunkArrayInGroups<T>(arr: T[], size: number) {
  const myArray = [];
  for(let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}
