import { trpc } from "./trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../apinext/src/index";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type User = RouterOutput["user"];

export function useIsSignedIn() {
  const { data } = trpc.user.useQuery();
  console.log(data);

  return data !== undefined;
}

export function useIsSignedOut() {
  const { data } = trpc.user.useQuery();

  return data === undefined;
}

export function useIsUserNotBeeping() {
  const { data } = trpc.user.useQuery();

  return data?.isBeeping === false;
}
