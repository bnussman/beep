import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createORPCClient, DynamicLink, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { useQuery } from "@tanstack/react-query";
import { isWeb } from "./constants";
import { fetch as expoFetch } from "expo/fetch";
import { RPCLink as WSRPCLink } from '@orpc/client/websocket'
import type { AppRouter } from "../../orpc/src/index";
import { WebSocket } from "partysocket";
import type {
  AsyncIteratorClass,
  ClientContext,
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from "@orpc/server";

function getLocalIP() {
  if (isWeb) {
    return "localhost";
  }
  return Constants.expoConfig?.hostUri?.split(":")[0];
}

async function getAuthToken() {
  const tokens = await AsyncStorage.getItem("auth");

  if (tokens) {
    try {
      // When we login, we just store the response in AsyncStorage.
      // We get the token from there.
      const auth = JSON.parse(tokens) as Outputs["auth"]["login"];

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

const websocket = new WebSocket('ws://localhost:3001', async () => {
  return await getAuthToken();
})

const wsLink = new WSRPCLink({
  websocket
})

const ip = getLocalIP();

const url = __DEV__ ? `http://${ip}:3001` : "https://orpc.ridebeep.app";

const httpLink = new RPCLink({
  url,
  async fetch(request, init, context) {
    // @ts-expect-error using hacky workaround to send FormData if it is present
    if (request._bodyFormData) {
      const resp = await fetch(request.url, {
        // @ts-expect-error using hacky workaround to send FormData if it is present
        body: request._bodyFormData,
        headers: request.headers,
        method: request.method,
        signal: request.signal,
        ...init,
      });

      return resp;
    }
    const resp = await expoFetch(request.url, {
      body: await request.blob(),
      headers: request.headers,
      method: request.method,
      signal: request.signal,
      ...init,
    });

    return resp;
  },
  async headers() {
    const token = await getAuthToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  },
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});


const link = new DynamicLink<ClientContext>((options, path, input) => {
  console.log("Dynatmic Link", options.context.ORPC_OPERATION_CONTEXT)
  return wsLink
  if (options.context?.cache) {
    return wsLink
  }

  return httpLink;
})

export const client: RouterClient<AppRouter> = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
export const useUser = () => useQuery(
  orpc.user.updates.experimental_liveOptions({
    enabled: false,
  })
)

export type Outputs = InferRouterOutputs<AppRouter>;
export type Inputs = InferRouterInputs<AppRouter>;
export type UnwrapAsyncIterator<T> =
  T extends AsyncIteratorClass<infer TValue, any, any>
    ? TValue
    : never;