import * as Sentry from "@sentry/react-native";
import type { User } from "./user";

export function setUserContext(user: User): void {
  Sentry.setUser({ ...user } as Sentry.User);
}
