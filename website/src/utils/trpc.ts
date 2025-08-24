import { QueryClient } from "@tanstack/react-query";
import {
  createWSClient,
  httpLink,
  splitLink,
  wsLink,
  createTRPCClient,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../api";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

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

const wsClient = createWSClient({
  url: import.meta.env.VITE_API_ROOT
    ? `wss://${import.meta.env.VITE_API_ROOT}/subscriptions`
    : "ws://localhost:3000/subscriptions",
  retryDelayMs: () => 1_000,
  lazy: {
    enabled: true,
    closeMs: 0,
  },
  connectionParams() {
    const token = getAuthToken();
    if (token) {
      return { token };
    }
    return {};
  },
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink<AppRouter>({
      condition: (op) => op.type === "subscription",
      true: wsLink<AppRouter>({
        client: wsClient,
      }),
      false: httpLink({
        url: import.meta.env.VITE_API_ROOT
          ? `https://${import.meta.env.VITE_API_ROOT}`
          : "http://localhost:3000",
        headers() {
          const token = getAuthToken();
          if (token) {
            return { Authorization: `Bearer ${token}` };
          }
          return {};
        },
      }),
    }),
  ],
});
