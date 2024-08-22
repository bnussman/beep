import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, createWSClient, httpBatchLink, httpLink, splitLink, wsLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../apinext';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { isWeb } from './constants';
import Constants from 'expo-constants';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();

function getLocalIP() {
  if (isWeb) {
    return "localhost";
  }
  try {
    return Constants.experienceUrl.split("//")[1].split(":")[0];
  } catch (error) {
    return "192.168.1.65";
  }
}

const ip = getLocalIP();

const wsUrl = __DEV__
  ? `ws://${ip}:3001`
  : "wss://apinext.ridebeep.app";
const url = __DEV__
  ? `http://${ip}:3001`
  : "https://apinext.ridebeep.app";

export async function getAuthToken() {
  const tokens = await AsyncStorage.getItem("auth");

  if (tokens) {
    try {
      // When we login, we just store the response in AsyncStorage.
      // We get the token from there.
      const auth = JSON.parse(tokens) as RouterOutput['auth']['login'];

      return auth.tokens.id;
    } catch (error) {
      Sentry.captureException(error, { extra: { hint: "Error when parsing authentication token from AsyncStorage" } });

      return null;
    }
  }

  return null;
}

export const queryClient = new QueryClient();

const wsClient = createWSClient({
  url: wsUrl,
  lazy: {
    enabled: true,
    closeMs: 0,
  },
  async connectionParams() {
    const token = await getAuthToken();
    if (token) {
      return { token };
    }
    return {};
  }
});

const trpcHttpLink = httpLink({
  url,
  async headers() {
    const token = await getAuthToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }
});

export const trpcClient = trpc.createClient({
  links: [
    splitLink<AppRouter>({
      condition: (op) => op.type === 'subscription',
      true: wsLink<AppRouter>({
        client: wsClient
      }),
      false: trpcHttpLink,
    })
  ],
});

export const basicTrpcClient = createTRPCClient<AppRouter>({
  links: [trpcHttpLink]
});
