import * as Sentry from '@sentry/bun';

interface PushNotification {
  to: string;
  title: string;
  body: string;
  categoryId?: 'newbeep';
  data?: Record<string, string>;
}

export async function sendNotification(options: PushNotification) {
  try {
    await fetch('https://api.expo.dev/v2/push/send', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: options.to,
        title: options.title,
        body: options.body,
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
