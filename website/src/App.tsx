import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserContext } from './UserContext';
import { ThemeContext } from './ThemeContext';
import { GetUserDataQuery, User } from './generated/graphql';
import { ApolloProvider, gql, useQuery } from '@apollo/client';
import { client } from './utils/Apollo';
import { ChakraProvider, Container } from "@chakra-ui/react"
import { theme } from './utils/theme';
import { getInitialTheme } from './utils/utils';
import { Download } from './routes/Download';
import Home from './routes/Home';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import Profile from './routes/Profile';
import EditProfile from './routes/EditProfile';
import ForgotPassword from './routes/ForgotPassword';
import ResetPassword from './routes/ResetPassword';
import ChangePassword from './routes/ChangePassword';
import VerifyAccount from './routes/VerifyAccount';
import Admin from './routes/admin';
import Privacy from './routes/Privacy';
import Terms from './routes/Terms';
import Faq from './routes/FAQ';
import NavBar from './components/NavBar';
import About from './routes/About';
import Banners from './components/Banners';
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
      photoUrl
      capacity
      masksRequired
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
      photoUrl
      capacity
      masksRequired
      username
      role
      cashapp
      queueSize
    }
  }
`;

function Beep() {
  const { data, subscribeToMore, loading } = useQuery<GetUserDataQuery>(GetUserData);
  const [theme, setInternalTheme] = useState<string>(getInitialTheme());

  function setTheme(theme: string) {
    const root = window.document.documentElement;

    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);

    localStorage.setItem("color-theme", theme);

    setInternalTheme(theme);
  }

  useEffect(() => {
    if (data?.getUser?.id) {
      subscribeToMore({
        document: UserUpdates,
        updateQuery: (prev, { subscriptionData }) => {
          //@ts-ignore
          const newFeedItem = subscriptionData.data.getUserUpdates;
          return Object.assign({}, prev, {
            getUser: newFeedItem
          });
        }
      });
    }
  }, [data?.getUser?.id]);

  console.log(import.meta.env.VITE_GOOGLE_API_KEY);

  if (loading) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={data?.getUser as User}>
        <Router>
          <NavBar />
          <Container maxW="container.xl">
            <Banners />
            <Routes>
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route path="/password/reset/:id" element={<ResetPassword />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/password/change" element={<ChangePassword />} />
              <Route path="/account/verify/:id" element={<VerifyAccount />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/about" element={<About />} />
              <Route path='/download' element={<Download />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </ThemeContext.Provider>
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
