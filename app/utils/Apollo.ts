import { ApolloClient, ApolloLink, FetchResult, InMemoryCache, Operation, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition, Observable } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUploadLink } from 'apollo-upload-client';
import { Client, ClientOptions, createClient } from 'graphql-ws';
import { print } from 'graphql';

const ip = '192.168.1.18';
// const ip = '172.30.1.87';

const wsUrl = __DEV__ ? `ws://${ip}:3001/subscriptions` : "wss://ridebeep.app/subscriptions";
const url = __DEV__ ? `http://${ip}:3001/graphql` : "https://ridebeep.app/graphql";
// const wsUrl = "wss://staging.ridebeep.app/subscriptions";
// const url = "https://staging.ridebeep.app/graphql";

// const wsUrl = __DEV__ ? `wss://staging.ridebeep.app/subscriptions` : "wss://ridebeep.app/subscriptions";
// const url = __DEV__ ? `https://staging.ridebeep.app/graphql` : "https://ridebeep.app/graphql";
// const wsUrl = "wss://ridebeep.app/subscriptions";
// const url =  "https://ridebeep.app/graphql";

class WebSocketLink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
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
                new Error(err.map(({ message }) => message).join(', ')),
              );

            if (err instanceof CloseEvent)
              return sink.error(
                new Error(
                  `Socket closed with event ${err.code} ${err.reason || ''}`, // reason will be available on clean closes only
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
  const tokens = await AsyncStorage.getItem('auth');
  if (tokens) {
    const auth = JSON.parse(tokens);
    return {
      headers: {
        ...headers,
        Authorization: auth?.tokens?.id ? `Bearer ${auth?.tokens?.id}` : "",
      }
    }
  }
});

const wsLink = new WebSocketLink({
  url: wsUrl,
  retryAttempts: Infinity,
  connectionParams: async () => {
    const tokens = await AsyncStorage.getItem('auth');
    if (tokens) {
      const auth = JSON.parse(tokens);
      return {
        token: auth?.tokens?.id
      }
    }
  },
  on: {
    connected: () => console.log("[Websocket] Connected"),
    connecting: () => console.log("[Websocket] Connecting"),
    opened: () => console.log("[Websocket] Opened"),
    closed: () => console.log("[Websocket] Closed"),
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
);

const uploadLink = createUploadLink({
  uri: url,
  headers: {
    "keep-alive": "true"
  }
});

export const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    splitLink,
    // @ts-expect-error stop :(
    uploadLink
  ]),
  cache: new InMemoryCache(),
});