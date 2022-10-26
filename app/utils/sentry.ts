import * as Sentry from "sentry-expo";
import { isMobile } from "./constants";
import { User } from "../generated/graphql";

export function setUserContext(user: Partial<User>): void {
  if (isMobile) {
    Sentry.Native.setUser({ ...user } as Sentry.Native.User);
  } else {
    Sentry.Browser.setUser({ ...user } as Sentry.Native.User);
  }
}
