import { trpc } from "./trpc";

export function useUser() {
  const { data: user, ...query } = trpc.user.me.useQuery(undefined, { enabled: false });

  return { user, ...query };
}

export function useIsSignedIn() {
  const { data: user } = trpc.user.me.useQuery(undefined, { enabled: false });

  return user !== undefined;
}

export function useIsSignedOut() {
  const isSignedIn = useIsSignedIn();

  return !isSignedIn;
}

export function useIsUserNotBeeping() {
  const { data: user } = trpc.user.me.useQuery(undefined, { enabled: false });

  return !Boolean(user?.isBeeping);
}
