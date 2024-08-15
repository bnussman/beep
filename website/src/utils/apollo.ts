import {
  ApolloClient,
  InMemoryCache,
  split,
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

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

const uploadLink = createUploadLink({
  uri: getUrl(),
});

const authLink = setContext(async (_, { headers }) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const auth = JSON.parse(stored);
    return {
      headers: {
        ...headers,
        Authorization: auth?.tokens?.id
          ? `Bearer ${auth?.tokens?.id}`
          : undefined,
      },
    };
  }
});


const wsClient = createClient({
  url: getWSUrl(),
  lazy: true,
  retryAttempts: Infinity,
  isFatalConnectionProblem: () => false,
  shouldRetry: () => true,
  connectionParams() {
    const tokens = localStorage.getItem("user");
    if (tokens) {
      const auth = JSON.parse(tokens);
      return {
        token: auth?.tokens?.id,
      };
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
