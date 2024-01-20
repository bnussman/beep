import * as Sentry from "@sentry/react-native";
import type { User } from "./useUser";

export function setUserContext(user: Partial<User>): void {
  Sentry.setUser({ ...user } as Sentry.User);
}
