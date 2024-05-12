import React from 'react';
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { ApolloProvider, useSubscription } from '@apollo/client';
import { cache, client } from './utils/apollo';
import { Center, ChakraProvider, Container, Spinner } from "@chakra-ui/react"
import { theme } from './utils/theme';
import { Header } from './components/Header';
import { Banners } from './components/Banners';
import { Outlet, RouterProvider } from '@tanstack/react-router';
import { UserQuery, UserSubscription, useUser } from './utils/user';
import { router } from './utils/router';
import type { ResultOf } from 'gql.tada';

export type User = ResultOf<typeof UserQuery>['getUser'];

export function Beep() {
  const { user, loading } = useUser();

  useSubscription(UserSubscription, {
    onData({ data }) {
      cache.updateQuery({ query: UserQuery }, () => ({ getUser: data.data!.getUserUpdates }));
    },
    skip: !user,
  });

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Container as="main" maxW="container.xl" pt={20}>
        <Banners />
        <Outlet />
      </Container>
    </>
  );
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </ChakraProvider>
  );
}
