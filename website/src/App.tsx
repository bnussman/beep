import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GetUserDataQuery, UserUpdatesSubscription } from './generated/graphql';
import { ApolloProvider, gql, useQuery, useSubscription } from '@apollo/client';
import { cache, client } from './utils/Apollo';
import { Center, ChakraProvider, Container, Spinner } from "@chakra-ui/react"
import { theme } from './utils/theme';
import { Header } from './components/Header';
import { Banners } from './components/Banners';
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/700.css"

const Home = lazy(() => import('./routes/Home').then(module => ({ default: module.Home })))
const Download = lazy(() => import('./routes/Download').then(module => ({ default: module.Download })))
const Login = lazy(() => import('./routes/Login').then(module => ({ default: module.Login })))
const SignUp = lazy(() => import('./routes/SignUp').then(module => ({ default: module.SignUp })))
const EditProfile = lazy(() => import('./routes/EditProfile').then(module => ({ default: module.EditProfile })))
const ForgotPassword = lazy(() => import('./routes/ForgotPassword').then(module => ({ default: module.ForgotPassword })))
const ResetPassword = lazy(() => import('./routes/ResetPassword').then(module => ({ default: module.ResetPassword })))
const ChangePassword = lazy(() => import('./routes/ChangePassword').then(module => ({ default: module.ChangePassword })))
const VerifyAccount = lazy(() => import('./routes/VerifyAccount').then(module => ({ default: module.VerifyAccount })))
const Admin = lazy(() => import('./routes/admin').then(module => ({ default: module.Admin })))
const Privacy = lazy(() => import('./routes/Privacy').then(module => ({ default: module.Privacy })))
const Terms = lazy(() => import('./routes/Terms').then(module => ({ default: module.Terms })))
const NotFound = lazy(() => import('./components/NotFound').then(module => ({ default: module.NotFound })))

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
    <Router>
      <Header />
      <Container as="main" maxW="container.xl" pt={20}>
        <Banners />
        <Suspense>
          <Routes>
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:id" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/password/change" element={<ChangePassword />} />
            <Route path="/account/verify/:id" element={<VerifyAccount />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path='/download' element={<Download />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Container>
    </Router>
  );
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <Beep />
      </ApolloProvider>
    </ChakraProvider>
  );
}
