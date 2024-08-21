import * as Sentry from '@sentry/react-native';
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMainDefinition } from "@apollo/client/utilities";
// @ts-expect-error author is toxic
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
import { isWeb } from "./constants";
import { getAuthToken } from './trpc';

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

export const cache = new InMemoryCache();

const wsUrl = __DEV__
  ? `ws://${ip}:3000/subscriptions`
  : "wss://api.ridebeep.app/subscriptions";
const url = __DEV__
  ? `http://${ip}:3000/graphql`
  : "https://api.ridebeep.app/graphql";

// const wsUrl = "wss://api.staging.ridebeep.app/subscriptions";
// const url = "https://api.staging.ridebeep.app/graphql";

// const wsUrl = __DEV__ ? `wss://staging.ridebeep.app/subscriptions` : "wss://ridebeep.app/subscriptions";
// const url = __DEV__ ? `https://staging.ridebeep.app/graphql` : "https://ridebeep.app/graphql";
// const wsUrl = "wss://api.ridebeep.app/subscriptions";
// const url = "https://api.ridebeep.app/graphql";

const authLink = setContext(async (_, { headers }) => {
  const token = await getAuthToken();
  if (token) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      }
    };
  }
});

const wsClient = createClient({
  url: wsUrl,
  lazy: true,
  retryAttempts: Infinity,
  isFatalConnectionProblem: () => false,
  shouldRetry: () => true,
  async connectionParams() {
    const token = await getAuthToken();
    if (token) {
      return { token };
    }
  }
});

export const wsLink = new GraphQLWsLink(wsClient);

const splitLink = split(({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === "OperationDefinition" &&
    definition.operation === "subscription"
  );
}, wsLink);

function customIsExtractableFile(value: unknown): value is ReactNativeFile {
  return value instanceof ReactNativeFile;
}

export class ReactNativeFile {
  uri: string;
  name: string;
  type: string;

  constructor({ uri, name, type }: { uri: string, name: string, type: string }) {
    this.uri = uri;
    this.name = name;
    this.type = type;
  }
}

const uploadLink = createUploadLink({
  uri: url,
  isExtractableFile: isWeb ? undefined : customIsExtractableFile
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, splitLink, uploadLink]),
  cache,
});
