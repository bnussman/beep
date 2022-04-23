import * as Sentry from "sentry-expo";
import { isMobile } from "./config";

class _Logger {
  public info(data: any) {
    if (isMobile) Sentry.Native.captureMessage(data);
    //@ts-ignore
    else Sentry.Browser.captureMessage(data);
    console.log(data);
  }

  public error(e: any) {
    if (isMobile) Sentry.Native.captureException(e);
    //@ts-ignore
    else Sentry.Browser.captureException(e);
    console.warn(e);
  }
}

export const Logger = new _Logger();