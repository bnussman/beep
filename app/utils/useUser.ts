import { useTRPC } from "./trpc";

import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const trpc = useTRPC();
  const { data: user, ...query } = useQuery(trpc.user.me.queryOptions(undefined, { enabled: false, retry: false }));

  return { user, ...query };
}

export function useIsSignedIn() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.me.queryOptions(undefined, { enabled: false }));

  return user !== undefined;
}

export function useIsSignedOut() {
  const isSignedIn = useIsSignedIn();

  return !isSignedIn;
}

export function useIsUserNotBeeping() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.me.queryOptions(undefined, { enabled: false }));

  return !Boolean(user?.isBeeping);
}
