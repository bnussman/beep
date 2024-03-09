import { HTTPHeaders, createTRPCReact, createWSClient, httpBatchLink, splitLink, wsLink } from '@trpc/react-query';
import type { AppRouter } from '../../apinext/src/index';
import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

const wsClient = createWSClient({
  url: 'ws://localhost:3001/ws',
});

export const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition(op) {
          return op.type === 'subscription';
      },
      true: wsLink<AppRouter>({
        client: wsClient
      }),
      false: httpBatchLink({
        url: 'http://localhost:3001/trpc',
        headers: getHeaders,
      }),
    }),
  ],
});

async function getHeaders(): Promise<HTTPHeaders> {
  const tokens = await AsyncStorage.getItem("auth");

  if (tokens) {
    const auth = JSON.parse(tokens);

    return {
      Authorization: `Bearer ${auth?.tokens?.id}`
    };
  }

  return {};
}
