import { ApolloClient, InMemoryCache, split,  ApolloLink, Operation, FetchResult, Observable } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { Client, ClientOptions, createClient } from 'graphql-ws';
import { print } from 'graphql';

function getUrl() {
  if (import.meta.env.ENVIRONMENT_NAME === 'production') {
    return 'https://api.ridebeep.app/graphql';
  }
  if (import.meta.env.ENVIRONMENT_NAME === 'preview') {
    return 'https://api.staging.ridebeep.app/graphql';
  }
  return 'http://localhost:3001/graphql'
}

function getWSUrl() {
  if (import.meta.env.ENVIRONMENT_NAME === 'production') {
    return 'wss://api.ridebeep.app/subscriptions';
  }
  if (import.meta.env.ENVIRONMENT_NAME === 'preview') {
    return 'wss://api.staging.ridebeep.app/subscriptions';
  }
  return 'ws://localhost:3001/subscriptions'
}

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
                  `Socket closed with event ${err.code} ${err.reason || ''}`,
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
  uri: getUrl(),
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
  url: getWSUrl(),
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
