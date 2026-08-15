import * as Sentry from "@sentry/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createORPCClient, DynamicLink, ORPCError, RPCJsonSerializer } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { RPCLink as WSRPCLink } from '@orpc/client/websocket'
import { AppRouterClient, RouterOutputs } from '../../../orpc/src'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { isWeb } from "./constants";
import { ClientRetryPlugin } from '@orpc/client/plugins'
import { RPCSerializer } from "./serializer";

export async function getAuthToken() {
  const tokens = await AsyncStorage.getItem("auth");

  if (tokens) {
    try {
      // When we login, we just store the response in AsyncStorage.
      // We get the token from there.
      const auth = JSON.parse(tokens) as RouterOutputs["auth"]["login"];

      return auth.tokens.id;
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          hint: "Error when parsing authentication token from AsyncStorage",
        },
      });

      return null;
    }
  }

  return null;
}

function getLocalIP() {
  if (isWeb) {
    return "localhost";
  }
  return Constants.expoConfig?.hostUri?.split(":")[0];
}

const ip = getLocalIP();

const origin = __DEV__ ? `http://${ip}:3001` : "https://orpc.ridebeep.app";
const wsUrl = __DEV__
  ? `ws://${ip}:3001`
  : "wss://orpc.ridebeep.app";

const httpLink = new RPCLink({
  origin,
  url: '/',
  headers: async () => {
    const token = await getAuthToken();

    if (!token) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  },
  serializer: new RPCSerializer()
})

interface ClientContext {
  ws?: boolean
}

const wsLink = new WSRPCLink({
  connect: () => new WebSocket(wsUrl),
  reconnect: {
    enabled: true,
    delay(info) {
      return info.attempt === 1 ? 0 : 2_000;
    },
    onClose: {
      enabled: true,
    }
  },
  plugins: [
    new ClientRetryPlugin({
      default: {
        retryDelay: (value) => {
          return value.attempt === 1 ? 0 : 2_000
        },
        retry: () => {
          return Number.POSITIVE_INFINITY
        },
        shouldRetry: (ctx) => {
          if (ctx.error instanceof ORPCError && ctx.error.code === "UNAUTHORIZED") {
            return false;
          }
          return true;
        },
      },
    }),
  ],
  headers: async () => {
     const token = await getAuthToken();

     if (!token) {
       return {};
     }

     return { Authorization: `Bearer ${token}` };
   },
})

const link = new DynamicLink<ClientContext>((options, path, input) => {
  if (options.context.ws) {
    return wsLink
  }

  return httpLink
})

export const orpcClient: AppRouterClient = createORPCClient(link)

export const orpc = createTanstackQueryUtils(orpcClient);
