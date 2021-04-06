import 'react-native-gesture-handler';
import React, { Component, ReactNode, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppState, StyleSheet } from 'react-native';
import RegisterScreen from './routes/auth/Register';
import LoginScreen from './routes/auth/Login';
import { ForgotPasswordScreen } from './routes/auth/ForgotPassword';
import { MainTabs } from './navigators/MainTabs';
import { ProfileScreen } from './routes/global/Profile';
import { ReportScreen } from './routes/global/Report';
import { RateScreen } from './routes/global/Rate';
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
import { ApolloProvider, gql, useQuery } from '@apollo/client';
import { GetUserDataQuery, User } from './generated/graphql';

const Stack = createStackNavigator();
init();

const GetUserData = gql`
    query GetUserData {
        getUser {
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

function Beep() {
    const { data, loading, subscribeToMore } = useQuery<GetUserDataQuery>(GetUserData, { errorPolicy: 'none' });
    const [theme, setTheme] = useState<"light" | "dark">("light");

    function toggleTheme() {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        AsyncStorage.setItem('theme', next);
    }

    useEffect(() => {
        if (data?.getUser.id) {
            if (isMobile) updatePushToken();

            subscribeToMore({
                document: UserUpdates,
                variables: {
                    topic: data?.getUser.id
                },
                updateQuery: (prev, { subscriptionData }) => {
                    console.log("Sub new data ", subscriptionData);
                    const newFeedItem = subscriptionData.data.getUserUpdates;
                    return Object.assign({}, prev, {
                        getUser: newFeedItem
                    });
                }
            });
        }
    }, [data?.getUser]);

    if (loading) return null;

    return (
        <UserContext.Provider value={data?.getUser as User}>
            <ThemeContext.Provider value={{theme, toggleTheme}}>
                <IconRegistry icons={EvaIconsPack} />
                <ApplicationProvider {...eva} theme={{ ...eva[theme], ...beepTheme }}>
                    <Layout style={styles.statusbar}>
                        <ThemedStatusBar theme={theme}/>
                    </Layout>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName={data?.getUser.id ? "Main" : "Login"} screenOptions={{ headerShown: false }} >
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="Register" component={RegisterScreen} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                            <Stack.Screen name="Main" component={MainTabs} />
                            <Stack.Screen name='Profile' component={ProfileScreen} />
                            <Stack.Screen name='Report' component={ReportScreen} />
                            <Stack.Screen name='Rate' component={RateScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </ApplicationProvider>
            </ThemeContext.Provider>
        </UserContext.Provider>
    );
}

const styles = StyleSheet.create({
    statusbar: {
        paddingTop: getStatusBarHeight()
    }
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Beep/>
        </ApolloProvider>
    );
}

export default App;
