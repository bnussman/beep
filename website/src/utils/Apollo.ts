import { ApolloClient, ApolloLink, InMemoryCache, split } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const ip = "localhost:3001";

const uploadLink = createUploadLink({
    uri: 'http://'+ ip + '/graphql',
    headers: {
        "keep-alive": "true"
    }
});

const authLink = setContext(async (_, { headers }) => {
    const stored = localStorage.getItem('user');

    if (!stored) return;

    const auth = JSON.parse(stored);

    return {
        headers: {
            ...headers,
            Authorization: auth.tokens.id ? `Bearer ${auth.tokens.id}` : undefined
        }
    }
});

const wsLink = new WebSocketLink({
  uri: `ws://${ip}/subscriptions`,
  options: {
      reconnect: true,
      connectionParams: async () => {
          const tit = localStorage.getItem('user');

          if (!tit) return;

          const auth = JSON.parse(tit);
          return {
              token: auth.tokens.id
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
        //@ts-ignore
        uploadLink
    ]),
    cache: new InMemoryCache({
        addTypename: false
    }),
});
