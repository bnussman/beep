import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMainDefinition, Observable } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { Client, ClientOptions, createClient } from "graphql-ws";
import { print } from "graphql";
import { setContext } from "@apollo/client/link/context";
import { Logger } from "./Logger";
import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  InMemoryCache,
  Operation,
  split,
} from "@apollo/client";
import Constants from "expo-constants";

const ip = Constants.experienceUrl.split("//")[1].split(":")[0];

export const cache = new InMemoryCache();

alert(Constants.experienceUrl)

const wsUrl = __DEV__
  ? `ws://${ip}:3001/subscriptions`
  : "wss://api.ridebeep.app/subscriptions";
const url = __DEV__
  ? `http://${ip}:3001/graphql`
  : "https://api.ridebeep.app/graphql";
// const wsUrl = "wss://staging.ridebeep.app/subscriptions";
// const url = "https://staging.ridebeep.app/graphql";

// const wsUrl = __DEV__ ? `wss://staging.ridebeep.app/subscriptions` : "wss://ridebeep.app/subscriptions";
// const url = __DEV__ ? `https://staging.ridebeep.app/graphql` : "https://ridebeep.app/graphql";
// const wsUrl = "wss://api.ridebeep.app/subscriptions";
// const url = "https://api.ridebeep.app/graphql";

interface RestartableClient extends Client {
  restart(): void;
}

function createRestartableClient(options: ClientOptions): RestartableClient {
  let restartRequested = false;
  let restart = () => {
    restartRequested = true;
  };

  const client = createClient({
    ...options,
    on: {
      ...options.on,
      opened: (socket: any) => {
        options.on?.opened?.(socket);

        restart = () => {
          if (socket.readyState === WebSocket.OPEN) {
            // if the socket is still open for the restart, do the restart
            socket.close(4205, "Client Restart");
          } else {
            // otherwise the socket might've closed, indicate that you want
            // a restart on the next opened event
            restartRequested = true;
          }
        };

        // just in case you were eager to restart
        if (restartRequested) {
          restartRequested = false;
          restart();
        }
      },
    },
  });

  return {
    ...client,
    restart: () => restart(),
  };
}

class WebSocketLink extends ApolloLink {
  public client: RestartableClient;

  constructor(options: ClientOptions) {
    super();
    this.client = createRestartableClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: (err) => {
            if (Array.isArray(err))
              // GraphQLError[]
              return sink.error(
                new Error(err.map(({ message }) => message).join(", ")),
              );

            if (err instanceof CloseEvent)
              return sink.error(
                new Error(
                  `Socket closed with event ${err.code} ${err.reason || ""}`, // reason will be available on clean closes only
                ),
              );

            return sink.error(err);
          },
        },
      );
    });
  }
}

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

export const wsLink = new WebSocketLink({
  url: wsUrl,
  lazy: false,
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
