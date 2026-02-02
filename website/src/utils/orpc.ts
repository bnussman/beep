import { createORPCClient, onError } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { useQuery } from '@tanstack/react-query';
import type { AppRouter } from '../../../orpc/src/index'
import type { InferRouterInputs, InferRouterOutputs, RouterClient } from '@orpc/server'

const url = import.meta.env.VITE_API_ROOT
  ? `https://${import.meta.env.VITE_API_ROOT.replace('api.', 'orpc.')}`
  : "http://localhost:3001";

function getAuthToken() {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const auth = JSON.parse(stored) as Outputs["auth"]["login"];
      return auth.tokens.id;
    } catch (error) {
      // @todo log to Sentry
      return undefined;
    }
  }
  return undefined;
}

const link = new RPCLink({
  url,
  headers() {
    const token = getAuthToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  },
  interceptors: [
    onError((error) => {
      console.error(error)
    })
  ],
});

export const client: RouterClient<AppRouter> = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
export const useUser = () => useQuery(
  orpc.user.updates.experimental_liveOptions({
    enabled: false,
  })
)

export type Outputs = InferRouterOutputs<AppRouter>;
export type Inputs = InferRouterInputs<AppRouter>;