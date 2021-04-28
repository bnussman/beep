import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from './UserContext';
import { ThemeContext } from './ThemeContext';
import { GetUserDataQuery } from './generated/graphql';
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
import BeepAppBar from './components/AppBar';
import About from './routes/About';

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
    //const { data, subscribeToMore, loading } = useQuery<GetUserDataQuery>(GetUserData, { fetchPolicy: "network-only" });
    const { data, subscribeToMore, loading } = useQuery<GetUserDataQuery>(GetUserData, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-and-network' });
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
            console.log("Calling sub to more");
            subscribeToMore({
                document: UserUpdates,
                variables: {
                    topic: data?.getUser.id
                },
                updateQuery: (prev, { subscriptionData }) => {
                    console.log("Socket Updated User");
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
            {
                //<UserContext.Provider value={data?.getUser?.id ? { ...data?.getUser } : undefined}>
            }
            <UserContext.Provider value={data?.getUser}>
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
