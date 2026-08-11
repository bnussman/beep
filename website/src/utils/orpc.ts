import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { getAuthToken } from './trpc'
import { AppRouterClient } from '../../../orpc/src'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

const link = new RPCLink({
  origin: 'http://localhost:3001',
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
