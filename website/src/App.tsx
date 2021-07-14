import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from './UserContext';
import { ThemeContext } from './ThemeContext';
import { GetUserDataQuery, User } from './generated/graphql';
import { ApolloProvider, gql, useQuery } from '@apollo/client';
import { client } from './utils/Apollo';
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
import { ChakraProvider, extendTheme, Container, Box } from "@chakra-ui/react"
import { createStandaloneToast } from "@chakra-ui/react"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/700.css"
import Banners from './components/Banners';

const toast = createStandaloneToast();

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
    subscription UserUpdates($topic: String!) {
        getUserUpdates(topic: $topic) {
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

function getInitialTheme(): string {
  const storedPrefs = window.localStorage.getItem("color-theme");

  if (storedPrefs) {
    const root = window.document.documentElement
    const isDark = storedPrefs === "dark";

    root.classList.remove(isDark ? "light" : "dark")
    root.classList.add(storedPrefs)
    return storedPrefs;
  }

  return storedPrefs || "light";
}

function Beep() {
  const { data, subscribeToMore, loading } = useQuery<GetUserDataQuery>(GetUserData);
  const [theme, setInternalTheme] = useState<string>(getInitialTheme());

  function setTheme(theme: string) {
    const root = window.document.documentElement
    const isDark = theme === "dark";

    root.classList.remove(isDark ? "light" : "dark")
    root.classList.add(theme)

    localStorage.setItem("color-theme", theme)
    setInternalTheme(theme);
  }

  useEffect(() => {
    if (data?.getUser?.id) {
      subscribeToMore({
        document: UserUpdates,
        variables: {
          topic: data?.getUser.id
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (prev.getUser.queueSize < subscriptionData.data.getUser.queueSize) {
            toast({
              title: "A user was accepted into your queue!",
              description: "Use your Beep App to manage your riders!",
              status: "info",
              duration: 5000,
              isClosable: true,
            })
          }
          else if (prev.getUser.queueSize > subscriptionData.data.getUser.queueSize) {
            toast({
              title: "A rider left your queue!",
              description: "Use your Beep App to manage your riders!",
              status: "info",
              duration: 5000,
              isClosable: true,
            })
          }
          else {
            toast({
              title: "Profile Updated",
              description: "Your account has been updated",
              status: "success",
              duration: 5000,
              isClosable: true,
            })
          }
          //@ts-ignore
          const newFeedItem = subscriptionData.data.getUserUpdates;
          return Object.assign({}, prev, {
            getUser: newFeedItem
          });
        }
      });
    }
    //}, [data?.getUser?.id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.getUser?.id]);

  if (loading) return null;

  return (
    <ApolloProvider client={client}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <UserContext.Provider value={data?.getUser as User}>
          <Router>
            <Box>
              <NavBar />
              <Container maxW="container.xl">
                <Banners />
                <Switch>
                  <Route path="/password/forgot" component={ForgotPassword} />
                  <Route path="/password/reset/:id" component={ResetPassword} />
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={SignUp} />
                  <Route exact path="/profile" component={Profile} />
                  <Route path="/profile/edit" component={EditProfile} />
                  <Route path="/password/change" component={ChangePassword} />
                  <Route path="/account/verify/:id" component={VerifyAccount} />
                  <Route path="/privacy" component={Privacy} />
                  <Route path="/terms" component={Terms} />
                  <Route path="/admin" component={Admin} />
                  <Route path="/faq" component={Faq} />
                  <Route path="/about" component={About} />
                  <Route path="/" component={Home} />
                </Switch>
              </Container>
            </Box>
          </Router>
        </UserContext.Provider>
      </ThemeContext.Provider>
    </ApolloProvider>
  );
}
const theme = extendTheme({
  fonts: {
    heading: "poppins",
    body: "poppins",
  },
  colors: {
    brand: {
      100: "#FFF9CC",
      200: "#FFE041",
      300: "#FFE967",
      400: "#FFE041",
      500: "#FFD203",
      600: "#DBB002",
      700: "#B79001",
      800: "#937100",
      900: "#7A5B00",
    },
  },
})


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
