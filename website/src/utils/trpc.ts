import { QueryClient } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, httpLink, splitLink, wsLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../apinext';
import { getAuthToken } from './apollo';

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

export const trpcClient = trpc.createClient({
  links: [
    splitLink<AppRouter>({
      condition: (op) => op.type === 'subscription',
      true: wsLink<AppRouter>({
        client: wsClient
      }),
      false: httpLink({
        url: 'http://localhost:3001/trpc',
        headers() {
          const token = getAuthToken();

          return { Authorization: `Bearer ${token}` };
        }
      }),
    })
  ],
});
