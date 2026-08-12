import * as Sentry from "@sentry/react";
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { AppRouterClient, RouterOutputs } from '../../../orpc/src'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

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
  : "http://localhost:3001";

const link = new RPCLink({
  origin,
  url: '/',
  headers: () => {
    const token = getAuthToken();

    if (!token) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  },
})

export const orpcClient: AppRouterClient = createORPCClient(link)

export const orpc = createTanstackQueryUtils(orpcClient);
