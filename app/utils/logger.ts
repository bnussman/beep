import * as Sentry from "@sentry/react-native";

class _Logger {
  public info(data: any) {
    Sentry.captureMessage(data);
    console.info(data);
  }

  public error(e: any) {
    Sentry.captureException(e);
    console.error(e);
  }
}

export const Logger = new _Logger();
