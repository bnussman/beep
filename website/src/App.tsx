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
import { trpc, queryClient, trpcClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ResultOf } from 'gql.tada';

export type User = ResultOf<typeof UserQuery>['getUser'];

export function Beep() {
  const { user, loading } = useUser();

  // Test Query
  const data = trpc.me.useQuery();

 // Test Subscription
  trpc.updates.useSubscription(undefined, { onData: console.log })

  // Test Mutation
  const { mutateAsync } = trpc.update.useMutation();

  // trpcClient.me.query()

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
      <button onClick={() => mutateAsync()}>test tRPC</button>
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
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </trpc.Provider>
      </ApolloProvider>
    </ChakraProvider>
  );
}
