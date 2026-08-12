import * as Sentry from "@sentry/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { AppRouterClient, RouterOutputs } from '../../../orpc/src'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { isWeb } from "./constants";

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

const url = __DEV__ ? `http://${ip}:3001` : "https://orpc.ridebeep.app";

const link = new RPCLink({
  origin,
  url: '/',
  headers: async () => {
    const token = await getAuthToken();

    if (!token) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  },
})

export const orpcClient: AppRouterClient = createORPCClient(link)

export const orpc = createTanstackQueryUtils(orpcClient);
