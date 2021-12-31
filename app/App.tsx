import "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar, AppState, AppStateStatus } from "react-native";
import RegisterScreen from "./routes/auth/Register";
import LoginScreen from "./routes/auth/Login";
import { ForgotPasswordScreen } from "./routes/auth/ForgotPassword";
import { ProfileScreen } from "./routes/global/Profile";
import { ReportScreen } from "./routes/global/Report";
import { RateScreen } from "./routes/global/Rate";
import { UserContext } from "./utils/UserContext";
import { updatePushToken } from "./utils/Notifications";
import init from "./utils/Init";
import { client } from "./utils/Apollo";
import { ApolloProvider, useQuery } from "@apollo/client";
import { User } from "./generated/graphql";
import Sentry from "./utils/Sentry";
import { GetUserData, UserUpdates } from "./utils/UserQueries";
import { extendTheme, NativeBaseProvider, useColorMode } from "native-base";
import { BeepDrawer } from "./navigators/Drawer";
import { colorModeManager } from "./utils/theme";
import { PickBeepScreen } from "./routes/ride/PickBeep";

const Stack = createStackNavigator();
init();
Sentry.init();

const newColorTheme = {
  primary: {
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
};

const beepTheme = extendTheme({
  colors: newColorTheme,
  config: {
    // useSystemColorMode: true,
    // initialColorMode: 'dark',
  },
});

function Beep() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data, loading, subscribeToMore } = useQuery(GetUserData, {
    errorPolicy: "none",
  });
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (data?.getUser?.id) {
        subscribeToMore({
          document: UserUpdates,
          variables: {
            id: data?.getUser.id,
          },
          updateQuery: (prev, { subscriptionData }) => {
            const newFeedItem = subscriptionData.data.getUserUpdates;
            if (newFeedItem) {
              Sentry.setUserContext(newFeedItem);
              return Object.assign({}, prev, {
                getUser: newFeedItem,
              });
            }
          },
        });
      }
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    if (data?.getUser.id) {
      updatePushToken();

      Sentry.setUserContext(data.getUser);

      subscribeToMore({
        document: UserUpdates,
        variables: {
          id: data.getUser.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          const newFeedItem = subscriptionData.data.getUserUpdates;
          if (newFeedItem) {
            Sentry.setUserContext(newFeedItem);
            return {
              getUser: newFeedItem,
            };
          }
        },
      });
    }
  }, [data?.getUser?.id]);

  if (loading) return null;
  console.log(colorMode);
  return (
    <UserContext.Provider value={data?.getUser as User}>
      <StatusBar
        barStyle={colorMode === "dark" ? "light-content" : "dark-content"}
      />
      <NavigationContainer
        theme={colorMode === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack.Navigator
          initialRouteName={data?.getUser?.id ? "Main" : "Login"}
        >
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen name="Sign Up" component={RegisterScreen} />
          <Stack.Screen
            name="Forgot Password"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Main"
            component={BeepDrawer}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="Rate" component={RateScreen} />
          <Stack.Screen name="Pick Beeper" component={PickBeepScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

function App2() {
  return (
    <NativeBaseProvider theme={beepTheme} colorModeManager={colorModeManager}>
      <Beep />
    </NativeBaseProvider>
  );
}

function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <App2 />
    </ApolloProvider>
  );
}

export default App;
