import React, { useEffect, useState } from 'react';
import Home from './routes/Home';
import Login from './routes/Login';
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
import { ApolloClient, ApolloProvider, DefaultOptions, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { ThemeContext } from './ThemeContext';

const httpLink = createUploadLink({
    //uri: 'https://beep-app-beep-staging.192.168.1.200.nip.io',
    uri: 'http://localhost:3001/graphql',
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

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        addTypename: false
    }),
    defaultOptions: defaultOptions
});

function getInitialTheme() {
    const storedPrefs = window.localStorage.getItem("color-theme");

    if (storedPrefs) {
        console.log("totae");
        const root = window.document.documentElement
        const isDark = storedPrefs === "dark";

        root.classList.remove(isDark ? "light" : "dark")
        root.classList.add(storedPrefs)
        return storedPrefs;
    }

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");

    if (userMedia.matches) {
        const root = window.document.documentElement;
        root.classList.remove("light");
        root.classList.add("dark")
        return "dark"
    }

    return "dark";
}

function App() {
    const [user, setInternalUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [theme, setInternalTheme] = useState(getInitialTheme());

    function setUser(d) {
        setInternalUser({ ...d });
    }

    function setTheme(theme: string) {
        const root = window.document.documentElement
        const isDark = theme === "dark";

        root.classList.remove(isDark ? "light" : "dark")
        root.classList.add(theme)

        localStorage.setItem("color-theme", theme)
        setInternalTheme(theme);
    }
    
    useEffect(() => {
    }, []);

    return (
        <ApolloProvider client={client}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
        <UserContext.Provider value={{user, setUser}}>
            <Router>
                <BeepAppBar/>
                <Switch>
                    <Route path="/password/forgot" component={ForgotPassword} />
                    <Route path="/password/reset/:id" component={ResetPassword} />
                    <Route path="/login" component={Login} />
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

export default App;
