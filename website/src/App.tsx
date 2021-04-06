import React, { useEffect, useState } from 'react';
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
import BeepAppBar from './components/AppBar';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from './UserContext';
import About from './routes/About';
import { ApolloClient, ApolloLink, ApolloProvider, DefaultOptions, gql, InMemoryCache, split, useQuery } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { ThemeContext } from './ThemeContext';
import {getMainDefinition} from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { GetUserDataQuery } from './generated/graphql';

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
        }
    }
`;

const UserUpdates = gql`
subscription UserUpdates($topic: String!) {
    getUserUpdates(topic: $topic) {
        id
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
    }
}
`;
const ip = "192.168.1.57:3001";

const uploadLink = createUploadLink({
    uri: 'http://'+ ip + '/graphql',
    headers: {
        "keep-alive": "true"
    }
});


const authLink = setContext(async (_, { headers }) => {
    const stored = localStorage.getItem('user');

    console.log("Making request with token", stored)

    if (!stored) return;

    const auth = JSON.parse(stored);

    return {
        headers: {
            ...headers,
            Authorization: auth.tokens.id ? `Bearer ${auth.tokens.id}` : undefined
        }
    }
});

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'none',
    }
};

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
    defaultOptions: defaultOptions
});

function getInitialTheme() {
    const storedPrefs = window.localStorage.getItem("color-theme");

    if (storedPrefs) {
        const root = window.document.documentElement
        const isDark = storedPrefs === "dark";

        root.classList.remove(isDark ? "light" : "dark")
        root.classList.add(storedPrefs)
        return storedPrefs;
    }

    return storedPrefs || "dark";
}

function Beep() {
    const { data, loading, subscribeToMore } = useQuery<GetUserDataQuery>(GetUserData, { fetchPolicy: "network-only" });
    const [theme, setInternalTheme] = useState(getInitialTheme());

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
                    //@ts-ignore
                    const newFeedItem = subscriptionData.data.getUserUpdates;
                    console.log("Sub new data ", newFeedItem);
                    return Object.assign({}, prev, {
                        getUser: newFeedItem
                    });
                }
            });
        }
        console.log("user updated!!!!!!!!!");
    //}, [data?.getUser?.id]);
    }, [data?.getUser]);

    console.log(data);

    return (
        <ApolloProvider client={client}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <UserContext.Provider value={data?.getUser?.id ? { ...data?.getUser } : undefined}>
            <Router>
                <BeepAppBar/>
                <Switch>
                    <Route path="/password/forgot" component={ForgotPassword} />
                    <Route path="/password/reset/:id" component={ResetPassword} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={SignUp} />
                    <Route exact path="/profile" component={Profile}/>
                    <Route path="/profile/edit/:id" component={EditProfile}/>
                    <Route path="/password/change" component={ChangePassword} />
                    <Route path="/account/verify/:id" component={VerifyAccount} />
                    <Route path="/privacy" component={Privacy} />
                    <Route path="/terms" component={Terms} />
                    <Route path="/admin" component={Admin} />
                    <Route path="/faq" component={Faq} />
                    <Route path="/about" component={About} />
                    <Route path="/" component={Home} />
                </Switch>
            </Router>
            {/*<Footer/>*/}
            </UserContext.Provider>
            </ThemeContext.Provider>
        </ApolloProvider>
    );
}

function App() {
    return (
        <ApolloProvider client={client}>
            <Beep/>
        </ApolloProvider>
    );
}

export default App;
