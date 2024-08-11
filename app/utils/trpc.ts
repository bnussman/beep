import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../apinext';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      async headers() {
        const tokens = await AsyncStorage.getItem("auth");
        if (tokens) {
          const auth = JSON.parse(tokens);
          return {
            Authorization: `Bearer ${auth?.tokens?.id}`
          };
        }
        return {};
      },
    }),
  ],
});
