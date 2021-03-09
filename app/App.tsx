import 'react-native-gesture-handler';
import React, { Component, ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppState, StyleSheet } from 'react-native';
import RegisterScreen from './routes/auth/Register';
import LoginScreen from './routes/auth/Login';
import { ForgotPasswordScreen } from './routes/auth/ForgotPassword';
import { MainTabs } from './navigators/MainTabs';
import { ProfileScreen } from './routes/global/Profile';
import { ReportScreen } from './routes/global/Report';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout } from '@ui-kitten/components';
import { default as beepTheme } from './utils/theme.json';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ThemeContext } from './utils/ThemeContext';
import { UserContext } from './utils/UserContext';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { updatePushToken } from "./utils/Notifications";
import AsyncStorage from '@react-native-community/async-storage';
import init from "./utils/Init";
import Sentry from "./utils/Sentry";
import { AuthContext } from './types/Beep';
import { isMobile } from './utils/config';
import ThemedStatusBar from './utils/StatusBar';
import { client } from './utils/Apollo';
import { ApolloProvider, gql } from '@apollo/client';

export let sub;
const Stack = createStackNavigator();
let initialScreen: string;
init();

interface State {
    user: AuthContext | null;
    theme: string;
}

const UserSubscription = gql`
    subscription UserSubscription($topic: String!) {
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
        }
    }
`;

const GetUserData = gql`
    query GetUserData($id: String!) {
        getUser(id: $id) {
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
        }
    }
`;

export default class App extends Component<undefined, State> {

    constructor() {
        super(undefined);
        this.state = {
            user: null,
            theme: "light"
        };
    }

    toggleTheme = (): void => {
        const nextempTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setState({ theme: nextempTheme });
        AsyncStorage.setItem('@theme', nextempTheme);
    }

    setUser = (user: AuthContext | null): void => {
        this.setState({ user: user });
        Sentry.setUserContext(user);
    }

    async subscribeToUser(id: string): Promise<void> {
        const a = client.subscribe({ query: UserSubscription, variables: { topic: id }});

        sub = a.subscribe(({ data }) => {
            console.log(data);
            const existingUser = this.state.user;
            const updatedUser = data.getUserUpdates;
            let changed = false;
            console.log("WHATTT");
            for (const key in updatedUser) {
                console.log(key);
                if (existingUser['user'][key] != updatedUser[key] && updatedUser[key] != null) {
                    existingUser['user'][key] = updatedUser[key];
                    console.log("Updating these values of user data:", key);
                    changed = true;
                }
            }
            if (changed) {
                this.setUser(existingUser);
                AsyncStorage.setItem('auth', JSON.stringify(existingUser));
            }
        });
    }

    handleAppStateChange = async (nextAppState: string) => {
        if(nextAppState === "active") {
            const result = await client.query({
                query: GetUserData,
                variables: {
                    id: this.state.user?.user.id
                },
                fetchPolicy: "network-only"
            });

            const existingUser = this.state.user;
            const updatedUser = result.data.getUser;

            let changed = false;

            for (const key in updatedUser) {
                if (existingUser['user'][key] != updatedUser[key]) {
                    existingUser['user'][key] = updatedUser[key];
                    console.log("Updating these values of user data:", key);
                    changed = true;
                }
            }
            if (changed) {
                this.setUser(existingUser);
                AsyncStorage.setItem('auth', JSON.stringify(existingUser));
            }
        }
    }

    async componentDidMount(): Promise<void> {
        AppState.addEventListener("change", this.handleAppStateChange);

        let user;
        let theme = this.state.theme;

        const storageData = await AsyncStorage.multiGet(['auth', '@theme']);

        if (storageData[0][1]) {
            initialScreen = "Main";
            user = JSON.parse(storageData[0][1]);

            if (isMobile && user.tokens.id) {
                updatePushToken();
            }

            Sentry.setUserContext(user);
            this.subscribeToUser(user.user.id);
        }
        else {
            initialScreen = "Login";
        }

        if (storageData[1][1]) {
            theme = storageData[1][1];
        }

        this.setState({
            user: user,
            theme: theme
        });
        this.handleAppStateChange("active");
    }

    render(): ReactNode {
        if (!initialScreen) {
            return null;
        }

        const user = this.state.user;
        const setUser = this.setUser;
        const theme = this.state.theme;
        const toggleTheme = this.toggleTheme;

        return (
            <ApolloProvider client={client}>
                <UserContext.Provider value={{user, setUser}}>
                    <ThemeContext.Provider value={{theme, toggleTheme}}>
                        <IconRegistry icons={EvaIconsPack} />
                        <ApplicationProvider {...eva} theme={{ ...eva[this.state.theme], ...beepTheme }}>
                            <Layout style={styles.statusbar}>
                                <ThemedStatusBar theme={this.state.theme}/>
                            </Layout>
                            <NavigationContainer>
                                <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }} >
                                    <Stack.Screen name="Login" component={LoginScreen} />
                                    <Stack.Screen name="Register" component={RegisterScreen} />
                                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                                    <Stack.Screen name="Main" component={MainTabs} />
                                    <Stack.Screen name='Profile' component={ProfileScreen} />
                                    <Stack.Screen name='Report' component={ReportScreen} />
                                </Stack.Navigator>
                            </NavigationContainer>
                        </ApplicationProvider>
                    </ThemeContext.Provider>
                </UserContext.Provider>
            </ApolloProvider>
        );
    }
}

const styles = StyleSheet.create({
    statusbar: {
        paddingTop: getStatusBarHeight()
    }
});
