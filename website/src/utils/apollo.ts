import {
  ApolloClient,
  InMemoryCache,
  split,
  ApolloLink,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../../../apinext';

function getUrl() {
  // return 'https://api.dev.ridebeep.app/graphql';
  if (import.meta.env.VITE_ENVIRONMENT_NAME === "production") {
    return "https://api.ridebeep.app/graphql";
  }
  if (import.meta.env.VITE_ENVIRONMENT_NAME === "preview") {
    return "https://api.staging.ridebeep.app/graphql";
  }
  return "http://localhost:3000/graphql";
}

function getWSUrl() {
  // return 'wss://api.dev.ridebeep.app/subscriptions';
  if (import.meta.env.VITE_ENVIRONMENT_NAME === "production") {
    return "wss://api.ridebeep.app/subscriptions";
  }
  if (import.meta.env.VITE_ENVIRONMENT_NAME === "preview") {
    return "wss://api.staging.ridebeep.app/subscriptions";
  }
  return "ws://localhost:3000/subscriptions";
}

type RouterOutput = inferRouterOutputs<AppRouter>;

const uploadLink = createUploadLink({
  uri: getUrl(),
});

export function getAuthToken() {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const auth = JSON.parse(stored) as RouterOutput['auth']['login'];
      return auth.tokens.id;
    } catch (error) {
      // @todo log to Sentry
      return undefined;
    }
  }
  return undefined;
}

const authLink = setContext(async (_, { headers }) => {
  const token = getAuthToken();

  if (token) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }
});

const wsClient = createClient({
  url: getWSUrl(),
  lazy: true,
  retryAttempts: Infinity,
  isFatalConnectionProblem: () => false,
  shouldRetry: () => true,
  connectionParams() {
    const token = getAuthToken();

    if (token) {
      return { token };
    }
  },
});

export const wsLink = new GraphQLWsLink(wsClient);

const splitLink = split(({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === "OperationDefinition" &&
    definition.operation === "subscription"
  );
}, wsLink);

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, splitLink, uploadLink]),
  cache,
});
