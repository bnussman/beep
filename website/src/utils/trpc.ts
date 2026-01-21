import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "../../../api";
import { createORPCClient, onError } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { RouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import type { InferRouterOutputs, InferRouterInputs } from '@orpc/server'

export type RouterInput = InferRouterInputs<AppRouter>;
export type RouterOutput = InferRouterOutputs<AppRouter>;

export function getAuthToken() {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const auth = JSON.parse(stored) as RouterOutput["auth"]["login"];
      return auth.tokens.id;
    } catch (error) {
      // @todo log to Sentry
      return undefined;
    }
  }
  return undefined;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const link = new RPCLink({
  url: import.meta.env.VITE_API_ROOT
    ? `https://${import.meta.env.VITE_API_ROOT}`
    : "http://localhost:3000",
  headers() {
    const token = getAuthToken();
    if (token) {
      return { token };
    }
    return {};
  },
})

const client: RouterClient<AppRouter> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)

