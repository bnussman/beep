import { ApolloClient, ApolloLink, createHttpLink, DefaultOptions, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import AsyncStorage from '@react-native-community/async-storage';
import { createUploadLink } from 'apollo-upload-client';

const ip = '192.168.1.57';

const httpLink = createHttpLink({
    uri: `http://${ip}:3001/graphql`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${ip}:3001/subscriptions`,
  options: {
      reconnect: true,
      connectionParams: async () => {
          const tit = await AsyncStorage.getItem('auth');

          if (!tit) return;

          const auth = JSON.parse(tit);
          return {
              token: auth.tokens.id
          }
      }
  }
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const tit = await AsyncStorage.getItem('auth');

  if (!tit) return;

  const auth = JSON.parse(tit);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: auth.tokens.id ? `Bearer ${auth.tokens.id}` : "",
    }
  }
});

const defaultOptions: DefaultOptions = {
    watchQuery: {
        //fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        //fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
};

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
  uri: 'http://192.168.1.57:3001/graphql', // Apollo Server is served from port 4000
  headers: {
    "keep-alive": "true"
  }
})

export const client = new ApolloClient({
    link: ApolloLink.from([
        authLink,
        splitLink,
        uploadLink
    ]),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
});
