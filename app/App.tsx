import 'react-native-gesture-handler';
import React, { Component, ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './routes/auth/Register';
import LoginScreen from './routes/auth/Login';
import ForgotPassword from './routes/auth/ForgotPassword';
import { MainTabs } from './navigators/MainTabs';
import { ProfileScreen } from './routes/global/Profile';
import { ReportScreen } from './routes/global/Report';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout } from '@ui-kitten/components';
import { default as beepTheme } from './utils/theme.json';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ThemeContext } from './utils/ThemeContext';
import { UserContext } from './utils/UserContext';
import { updatePushToken } from "./utils/Notifications";
import socket, { getUpdatedUser } from './utils/Socket';
import AsyncStorage from '@react-native-community/async-storage';
import ThemedStatusBar from './utils/StatusBar';
import { styles } from './utils/Styles';
import { handleUpdateCheck } from './utils/Updates';
import init from './utils/Init';
import { setSentryUserContext } from './utils/Sentry';
import { User } from './types/Beep';
import { isMobile } from './utils/config';

const Stack = createStackNavigator();
let initialScreen: string;
init();

interface State {
    user: User | null;
    theme: string;
}

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

    setUser = (user: User | null): void => {
        this.setState({ user: user });
        setSentryUserContext(user);
    }
    
    async componentDidMount(): Promise<void> {
        handleUpdateCheck();

        socket.on("connect", () => {
            if (this.state.user) {
                socket.emit('getUser', this.state.user.token);
            }
        });

        let user;
        let theme = this.state.theme;

        const storageData = await AsyncStorage.multiGet(['@user', '@theme']);

        if (storageData[0][1]) {
            initialScreen = "Main";
            user = JSON.parse(storageData[0][1]);
            //If user is on a mobile device and user object has a token, sub them to notifications
            if (isMobile && user.token) {
                updatePushToken(user.token);
            }

            //if user has a token, subscribe them to user updates
            if (user.token) {
                socket.emit('getUser', user.token);
            }

            setSentryUserContext(user);
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

        socket.on('updateUser', (data: unknown) => {
            const updatedUser = getUpdatedUser(this.state.user, data);
            if (updatedUser != null) {
                console.log("[~] Updating Context!");
                AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
                this.setUser(updatedUser);
            }
        });
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
            <UserContext.Provider value={{user, setUser}}>
                <ThemeContext.Provider value={{theme, toggleTheme}}>
                    <IconRegistry icons={EvaIconsPack} />
                    <ApplicationProvider {...eva} theme={{ ...eva[this.state.theme], ...beepTheme }}>
                        <Layout style={styles.statusbar}>
                            <ThemedStatusBar theme={theme} />
                        </Layout>
                        <NavigationContainer>
                            <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }} >
                                <Stack.Screen name="Login" component={LoginScreen} />
                                <Stack.Screen name="Register" component={RegisterScreen} />
                                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                                <Stack.Screen name="Main" component={MainTabs} />
                                <Stack.Screen name='Profile' component={ProfileScreen} />
                                <Stack.Screen name='Report' component={ReportScreen} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </ApplicationProvider>
                </ThemeContext.Provider>
            </UserContext.Provider>
        );
    }
}
