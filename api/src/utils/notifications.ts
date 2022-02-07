import got from "got";

export interface PushNotification {
  to: string | string[];
  title: string;
  body: string;
}

/**
 * Use Expo's API to send a push notification
 * 
 * @param {string} token the Expo Push Token of the user
 * @param {string} title for the notification
 * @param {string} message is the body of the push notification
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
 * 
 * @param {PushNotification[]} notifications an array of Expo Notifications
 */
export async function sendNotifications(notifications: PushNotification[]): Promise<void> {
  await got.post('https://api.expo.dev/v2/push/send', { json: notifications });
}

export async function sendNotificationsNew(to: string[], title: string, body: string): Promise<void> {
  const batches = chunkArrayInGroups(to, 100);

  batches.forEach((batch) => {
    got.post('https://api.expo.dev/v2/push/send', {
      json: {
        to: batch,
        title,
        body,
      }
    });
  });
}

function chunkArrayInGroups<T>(arr: T[], size: number) {
  const myArray = [];
  for(let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}