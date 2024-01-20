import * as Sentry from "sentry-expo";
import { isMobile } from "./constants";
import type { User } from "./useUser";

export function setUserContext(user: Partial<User>): void {
  if (isMobile) {
    Sentry.Native.setUser({ ...user } as Sentry.Native.User);
  } else {
    Sentry.Browser.setUser({ ...user } as Sentry.Native.User);
  }
}
