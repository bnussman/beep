import { QueryClient } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, httpLink, splitLink, wsLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../apinext';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();

function getUrl() {
  if (import.meta.env.VITE_ENVIRONMENT_NAME === "production") {
    return "https://apinext.ridebeep.app";
  }
  if (import.meta.env.VITE_ENVIRONMENT_NAME === "preview") {
    return "https://apinext.staging.ridebeep.app";
  }
  return 'http://localhost:3001';
}

function getWSUrl() {
  if (import.meta.env.VITE_ENVIRONMENT_NAME === "production") {
    return "wss://apinext.ridebeep.app";
  }
  if (import.meta.env.VITE_ENVIRONMENT_NAME === "preview") {
    return "wss://apinext.staging.ridebeep.app";
  }
  return "ws://localhost:3001/trpc";
}

export function getAuthToken() {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const auth = JSON.parse(stored) as RouterOutput['auth']['login'];
      return auth.tokens.id;
    } catch (error) {
      // @todo log to Sentry
      return undefined;
    }
  }
  return undefined;
}

export const queryClient = new QueryClient();

const wsClient = createWSClient({
  url: getWSUrl(),
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
  }
});

export const trpcClient = trpc.createClient({
  links: [
    splitLink<AppRouter>({
      condition: (op) => op.type === 'subscription',
      true: wsLink<AppRouter>({
        client: wsClient
      }),
      false: httpLink({
        url: getUrl(),
        headers() {
          const token = getAuthToken();
          if (token) {
            return { Authorization: `Bearer ${token}` };
          }
          return {};
        }
      }),
    })
  ],
});
