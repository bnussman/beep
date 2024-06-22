import { QueryClient } from '@tanstack/react-query';
import { createTRPCReact, httpBatchLink, unstable_httpSubscriptionLink, splitLink } from '@trpc/react-query';
import type { AppRouter } from '../../api/src/utils/router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

const httpLink = httpBatchLink({
  url: 'http://localhost:3000/trpc',
  // You can pass any HTTP headers you wish here
  async headers() {
    const tokens = await AsyncStorage.getItem("auth");
    if (tokens) {
      const auth = JSON.parse(tokens);
      return {
        Authorization: `Bearer ${auth.tokens.id}`,
      };
    }
    return {};
  },
});

const subscriptionLink = unstable_httpSubscriptionLink({
  url: 'http://localhost:3000/trpc',
  // You can pass any HTTP headers you wish here
  async headers() {
    const tokens = await AsyncStorage.getItem("auth");
    if (tokens) {
      const auth = JSON.parse(tokens);
      return {
        authorization: auth.tokens.id,
      };
    }
    return {};
  },
});


export const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: subscriptionLink,
      false: httpLink,
    }),
  ],
});
