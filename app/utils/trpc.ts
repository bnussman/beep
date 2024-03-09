import { HTTPHeaders, createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '../../api/src/index';
import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      headers: getHeaders,
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
