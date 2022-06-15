import * as Sentry from "sentry-expo";
import { isMobile } from "./constants";

class _Logger {
  public info(data: any) {
    if (isMobile) {
      Sentry.Native.captureMessage(data);
    } else {
      Sentry.Browser.captureMessage(data);
    }
    console.log(data);
  }

  public error(e: any) {
    if (isMobile) {
      Sentry.Native.captureException(e);
    } else {
      Sentry.Browser.captureException(e);
    }
    console.warn(e);
  }
}

export const Logger = new _Logger();
