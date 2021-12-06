import { ApolloClient, InMemoryCache, split,  ApolloLink, Operation, FetchResult, Observable } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { Client, ClientOptions, createClient } from 'graphql-ws';
import { print } from 'graphql';

const dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const wsUrl = dev ? "ws://localhost:3001/subscriptions" : "wss://ridebeep.app/subscriptions";
const url = dev ? "http://localhost:3001/graphql" : "https://ridebeep.app/graphql";
// const wsUrl = "wss://ridebeep.app/subscriptions";
// const url = "https://ridebeep.app/graphql";
// const wsUrl = dev ? `wss://staging.ridebeep.app/subscriptions` : "wss://ridebeep.app/subscriptions";
// const url = dev ? `https://staging.ridebeep.app/graphql` : "https://ridebeep.app/graphql";

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

const uploadLink = createUploadLink({
  uri: url,
});

const authLink = setContext(async (_, { headers }) => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const auth = JSON.parse(stored);
    return {
      headers: {
        ...headers,
        Authorization: auth?.tokens?.id ? `Bearer ${auth?.tokens?.id}` : undefined
      }
    }
  }
});

const wsLink = new WebSocketLink({
  url: wsUrl,
  connectionParams: () => {
    const tokens = localStorage.getItem('user');
    if (tokens) {
      const auth = JSON.parse(tokens);
      return {
        token: auth?.tokens?.id
      }
    }
  }
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

export const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    splitLink,
    uploadLink
  ]),
  cache: new InMemoryCache()
});
