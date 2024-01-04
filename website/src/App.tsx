import React from 'react';
import { GetUserDataQuery, UserUpdatesSubscription } from './generated/graphql';
import { ApolloProvider, gql, useQuery, useSubscription } from '@apollo/client';
import { cache, client } from './utils/Apollo';
import { Center, ChakraProvider, Container, Spinner } from "@chakra-ui/react"
import { theme } from './utils/theme';
import { Header } from './components/Header';
import { Banners } from './components/Banners';
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/700.css"
import { Outlet, RootRoute, Router, RouterProvider } from '@tanstack/react-router';
import { indexRoute } from './routes/Home';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { editProfileRoute } from './routes/EditProfile';
import { changePasswordRoute } from './routes/ChangePassword';
import { loginRoute } from './routes/Login';
import { signupRoute } from './routes/SignUp';
import { notFoundRoute } from './components/NotFound';
import { forgotPasswordRoute } from './routes/ForgotPassword';
import { privacyRoute } from './routes/Privacy';
import { termsRoute } from './routes/Terms';
import { adminRoute } from './routes/admin';
import { usersListRoute, usersRoute } from './routes/admin/users';
import { userRoute } from './routes/admin/users/User';
import { userDetailsRoute } from './routes/admin/users/Details';
import { editUserRoute } from './routes/admin/users/edit';
import { locationRoute } from './routes/admin/users/Location';

export const GetUserData = gql`
  query GetUserData {
    getUser {
      id
      name
      first
      last
      email
      phone
      venmo
      isBeeping
      isEmailVerified
      isStudent
      groupRate
      singlesRate
      photo
      capacity
      username
      role
      cashapp
      queueSize
    }
  }
`;

const UserUpdates = gql`
  subscription UserUpdates {
    getUserUpdates {
      id
      name
      first
      last
      email
      phone
      venmo
      isBeeping
      isEmailVerified
      isStudent
      groupRate
      singlesRate
      photo
      capacity
      username
      role
      cashapp
      queueSize
    }
  }
`;

function Beep() {
  const { data, loading } = useQuery<GetUserDataQuery>(GetUserData);

  const user = data?.getUser;

  useSubscription<UserUpdatesSubscription>(UserUpdates, {
    onData({ data }) {
      cache.updateQuery<GetUserDataQuery>({ query: GetUserData }, () => ({ getUser: data.data!.getUserUpdates }));
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
        <TanStackRouterDevtools />
      </Container>
    </>
  );
}

export const rootRoute = new RootRoute({
  component: Beep,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  editProfileRoute,
  changePasswordRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  privacyRoute,
  termsRoute,
  adminRoute.addChildren([
    usersRoute.addChildren([
      usersListRoute,
      userRoute.addChildren([
        userDetailsRoute,
        editUserRoute,
        locationRoute,
      ])
    ]),
  ]),
]);

const router = new Router({ routeTree, notFoundRoute });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
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
