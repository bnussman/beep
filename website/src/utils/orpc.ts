import { createORPCClient, onError } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { RouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { getAuthToken } from './trpc';
import type { AppRouter } from '../../../orpc/src/index'
import { useQuery } from '@tanstack/react-query';

const url = import.meta.env.VITE_API_ROOT
  ? `https://${import.meta.env.VITE_API_ROOT.replace('api.', 'orpc.')}`
  : "http://localhost:3001";

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

