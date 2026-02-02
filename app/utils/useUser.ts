import { useUser } from "./orpc";

export function useIsSignedIn() {
  const { data: user } = useUser();

  return user !== undefined;
}

export function useIsSignedOut() {
  const isSignedIn = useIsSignedIn();

  return !isSignedIn;
}

export function useIsUserNotBeeping() {
  const { data: user } = useUser();

  return !Boolean(user?.isBeeping);
}
