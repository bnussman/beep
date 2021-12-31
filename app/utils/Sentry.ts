import * as SentryInternal from "sentry-expo";
import { isMobile } from "./config";
import config from "../package.json";

class Sentry {
  public init(): void {
    SentryInternal.init({
      release: config.version,
      dsn: "https://42a0df289b6347238f0c5cd8e09f4952@sentry.nussman.us/3",
      enableInExpoDevelopment: true,
      debug: true,
      enableAutoSessionTracking: true,
    });
  }

  public setUserContext(user: any): void {
    if (isMobile) {
      SentryInternal.Native.setUser({ ...user });
    } else {
      SentryInternal.Browser.setUser({ ...user });
    }
  }
}

const s = new Sentry();

export default s as Sentry;
