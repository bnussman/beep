import { createTRPCClient, createWSClient, wsLink, splitLink, httpBatchLink } from '@trpc/client';
import { getAuthToken } from './apollo';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../apinext';
import { QueryClient } from '@tanstack/react-query';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

const wsClient = createWSClient({
  url: 'ws://localhost:3001/trpc',
  lazy: {
    enabled: true,
    closeMs: 0,
  },
  connectionParams() {
    const token = getAuthToken();

    return { token };
  }
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({
        client: wsClient
      }),
      false: httpBatchLink({
        url: 'http://localhost:3001/trpc',
        headers() {
          const token = getAuthToken();

          return { Authorization: `Bearer ${token}` };
        }
      }),
    })
  ],
});
