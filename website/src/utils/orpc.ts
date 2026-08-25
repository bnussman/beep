import * as Sentry from "@sentry/react";
import { createORPCClient, DynamicLink, ORPCError } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { RPCLink as WSRPCLink } from '@orpc/client/websocket'
import { AppRouterClient, RouterOutputs } from '../../../api/src'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { ClientRetryPlugin } from '@orpc/client/plugins'

export function getAuthToken() {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const auth = JSON.parse(stored) as RouterOutputs["auth"]["login"];
      return auth.tokens.id;
    } catch (error) {
      Sentry.captureException(error);
      return undefined;
    }
  }
  return undefined;
}

const origin = import.meta.env.VITE_API_ROOT
  ? `https://${import.meta.env.VITE_API_ROOT}`
  : "http://localhost:3000";

const wsOrigin = import.meta.env.VITE_API_ROOT
  ? `wss://${import.meta.env.VITE_API_ROOT}`
  : "ws://localhost:3000";

const httpLink = new RPCLink({
  origin,
  url: '/',
  headers: () => {
    const token = getAuthToken();

    if (!token) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  },
  fetch(url, init, options, path) {
    return fetch(url, init);
  }
});

const wsLink = new WSRPCLink({
  connect: () => new WebSocket(wsOrigin),
  reconnect: {
    enabled: true,
    delay(info) {
      return info.attempt === 1 ? 0 : 2_000;
    },
    onClose: {
      enabled: true,
    }
  },
  plugins: [
    new ClientRetryPlugin({
      default: {
        retryDelay: (value) => {
          return value.attempt === 1 ? 0 : 2_000
        },
        retry: () => {
          return Number.POSITIVE_INFINITY
        },
        shouldRetry: (ctx) => {
          if (ctx.error instanceof ORPCError && ctx.error.code === "UNAUTHORIZED") {
            return false;
          }
          return true;
        },
      },
    }),
  ],
  headers: async () => {
     const token = getAuthToken();

     if (!token) {
       return {};
     }

     return { Authorization: `Bearer ${token}` };
   },
});

interface ClientContext {
  ws?: boolean
}

const link = new DynamicLink<ClientContext>((options, path, input) => {
  if (options.context.ws) {
    return wsLink
  }

  return httpLink
})

export const orpcClient: AppRouterClient = createORPCClient(link)

export const orpc = createTanstackQueryUtils(orpcClient);
