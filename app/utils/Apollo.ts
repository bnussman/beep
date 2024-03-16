import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { setContext } from "@apollo/client/link/context";
import { Logger } from "./Logger";
import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
import Constants from "expo-constants";

function getLocalIP() {
  try {
    return Constants.experienceUrl.split("//")[1].split(":")[0];
  } catch (error) {
    return "localhost";
  }
}

// const ip = "192.168.1.65";
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
//  const wsUrl = "wss://api.ridebeep.app/subscriptions";
// const url = "https://api.ridebeep.app/graphql";

const authLink = setContext(async (_, { headers }) => {
  const tokens = await AsyncStorage.getItem("auth");
  if (tokens) {
    const auth = JSON.parse(tokens);
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
  url: wsUrl,
  lazy: true,
  retryAttempts: Infinity,
  isFatalConnectionProblem: () => false,
  shouldRetry: () => true,
  connectionParams: async () => {
    const tokens = await AsyncStorage.getItem("auth");
    if (tokens) {
      const auth = JSON.parse(tokens);
      return {
        token: auth?.tokens?.id,
      };
    }
  },
  on: {
    connected: (socket, payload: Record<"user", any> | undefined) => {
      if (!payload?.user) {
        return;
      }

      try {
        cache.modify({
          id: cache.identify({
            __typename: "User",
            id: payload.user.id,
          }),
          fields: {
            isBeeping() {
              return payload.user.isBeeping;
            },
            isStudent() {
              return payload.user.isStudent;
            },
            isEmailVerified() {
              return payload.user.isEmailVerified;
            },
            first() {
              return payload.user.first;
            },
            last() {
              return payload.user.last;
            },
            phone() {
              return payload.user.phone;
            },
            venmo() {
              return payload.user.venmo;
            },
            cashapp() {
              return payload.user.cashapp;
            },
            photo() {
              return payload.user.photo;
            },
            name() {
              return payload.user.name;
            },
            email() {
              return payload.user.email;
            },
          },
        });
      } catch (e) {
        Logger.error(e);
      }
    },
    connecting: () => console.log("[Websocket] Connecting"),
    opened: () => console.log("[Websocket] Opened"),
    closed: () => console.log("[Websocket] Closed"),
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

const uploadLink = createUploadLink({
  uri: url,
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, splitLink, uploadLink]),
  cache,
});
