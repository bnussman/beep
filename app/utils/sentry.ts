import * as Sentry from "@sentry/react-native";
import { User } from "../generated/graphql";

export function setUserContext(user: Partial<User>): void {
  Sentry.setUser({ ...user } as Sentry.User);
}
