import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from "./utils/Init";
import { isMobile } from './utils/config';
import ThemedStatusBar from './utils/StatusBar';
import { client } from './utils/Apollo';
import { ApolloProvider, useQuery } from '@apollo/client';
import { GetUserDataQuery, User } from './generated/graphql';
import Sentry from './utils/Sentry';
import { GetUserData, UserUpdates } from './utils/UserQueries';

const Stack = createStackNavigator();
init();

function Beep() {
  const { data, loading, subscribeToMore } = useQuery<GetUserDataQuery>(GetUserData, { errorPolicy: 'none' });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (data?.getUser?.id) {
        subscribeToMore({
          document: UserUpdates,
          variables: {
            id: data?.getUser.id
          },
          updateQuery: (prev, { subscriptionData }) => {
            // @ts-expect-error I'm correct >:(
            const newFeedItem = subscriptionData.data.getUserUpdates;
            if (newFeedItem) {
              Sentry.setUserContext(newFeedItem);
              return Object.assign({}, prev, {
                getUser: newFeedItem
              });
            }
          }
        });
      }
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };


  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    AsyncStorage.setItem('theme', next);
  }

  useEffect(() => {
    const init = async () => {
      const storedTheme = await AsyncStorage.getItem('theme') as unknown as "light" | "dark" | undefined;

      if (storedTheme && (theme !== storedTheme)) setTheme(storedTheme);
    }

    init();
  }, []);

  useEffect(() => {
    if (data?.getUser.id) {
      if (isMobile) updatePushToken();

      Sentry.setUserContext(data.getUser);

      subscribeToMore({
        document: UserUpdates,
        variables: {
          id: data?.getUser.id
        },
        updateQuery: (prev, { subscriptionData }) => {
          // @ts-expect-error I'm correct >:(
          const newFeedItem = subscriptionData.data.getUserUpdates;
          if (newFeedItem) {
            Sentry.setUserContext(newFeedItem);
            return Object.assign({}, prev, {
              getUser: newFeedItem
            });
          }
        }
      });
    }
  }, [data?.getUser?.id]);

  if (loading) return null;

  return (
    <UserContext.Provider value={data?.getUser as User}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva[theme], ...beepTheme }}>
          <Layout style={styles.statusbar}>
            <ThemedStatusBar theme={theme} />
          </Layout>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={data?.getUser?.id ? "Main" : "Login"} screenOptions={{ headerShown: false }} >
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

function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <Beep />
    </ApolloProvider>
  );
}

export default App;
