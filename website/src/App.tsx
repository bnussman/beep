import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GetUserDataQuery, UserUpdatesSubscription } from './generated/graphql';
import { ApolloProvider, gql, useQuery, useSubscription } from '@apollo/client';
import { client } from './utils/Apollo';
import { Box, Center, ChakraProvider, Container, Spinner } from "@chakra-ui/react"
import { theme } from './utils/theme';
import { Download } from './routes/Download';
import { Home } from './routes/Home';
import { Login } from './routes/Login';
import { SignUp } from './routes/SignUp';
import { EditProfile } from './routes/EditProfile';
import { ForgotPassword  } from './routes/ForgotPassword';
import { ResetPassword  } from './routes/ResetPassword';
import { ChangePassword } from './routes/ChangePassword';
import { VerifyAccount } from './routes/VerifyAccount';
import { Admin } from './routes/admin';
import { Privacy } from './routes/Privacy';
import { Terms } from './routes/Terms';
import { Header } from './components/Header';
import { Banners } from './components/Banners';
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/700.css"

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
  const { data } = useSubscription<UserUpdatesSubscription>(UserUpdates);

  if (data?.getUserUpdates === undefined) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Router>
      <Header />
      <Container maxW="container.xl">
        <Banners />
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
        </Routes>
      </Container>
    </Router>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <Beep />
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default App;