import "react-native-gesture-handler";
import React, { useEffect } from "react";
import * as Sentry from "sentry-expo";
import config from "./package.json";
import { init } from "./utils/Init";
import { LoginScreen } from "./routes/auth/Login";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import { ForgotPasswordScreen } from "./routes/auth/ForgotPassword";
import { ProfileScreen } from "./routes/global/Profile";
import { ReportScreen } from "./routes/global/Report";
import { RateScreen } from "./routes/global/Rate";
import { client } from "./utils/Apollo";
import { ApolloProvider, useQuery } from "@apollo/client";
import { User, UserDataQuery } from "./generated/graphql";
import { NativeBaseProvider, useColorMode } from "native-base";
import { BeepDrawer } from "./navigators/Drawer";
import { colorModeManager } from "./utils/theme";
import { PickBeepScreen } from "./routes/ride/PickBeep";
import { updatePushToken } from "./utils/Notifications";
import { SignUpScreen } from "./routes/auth/SignUp";
import { UserData, UserSubscription } from "./utils/useUser";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import {
  isMobile,
  NATIVE_BASE_CONFIG,
  NATIVE_BASE_THEME,
} from "./utils/constants";

const Stack = createStackNavigator();
init();
Sentry.init({
  release: config.version,
  dsn: "https://22da81efd1744791aa86cfd4bf8ea5eb@o1155818.ingest.sentry.io/6358990",
  enableInExpoDevelopment: true,
  debug: true,
  enableAutoSessionTracking: true,
});

function setUserContext(user: Partial<User>): void {
  if (isMobile) {
    Sentry.Native.setUser({ ...user });
  } else {
    Sentry.Browser.setUser({ ...user });
  }
}

function Beep() {
  const { colorMode } = useColorMode();
  const { data, loading, subscribeToMore } = useQuery<UserDataQuery>(UserData, {
    errorPolicy: "none",
  });

  const user = data?.getUser;

  useEffect(() => {
    if (user) {
      subscribeToMore({
        document: UserSubscription,
        updateQuery: (prev, { subscriptionData }) => {
          // @ts-expect-error we are correct
          const newFeedItem = subscriptionData.data.getUserUpdates;
          return Object.assign({}, prev, {
            getUser: newFeedItem,
          });
        },
      });

      setUserContext(user);
      updatePushToken(user.pushToken);
    }
  }, [user]);

  if (loading) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle={colorMode === "dark" ? "light-content" : "dark-content"}
      />
      <NavigationContainer
        theme={colorMode === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack.Navigator
          initialRouteName={user ? "Main" : "Login"}
          screenOptions={{
            headerTintColor: colorMode === "dark" ? "white" : "black",
          }}
        >
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen name="Sign Up" component={SignUpScreen} />
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
          <Stack.Screen name="Pick Driver" component={PickBeepScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

function App2() {
  return (
    <NativeBaseProvider
      theme={NATIVE_BASE_THEME}
      colorModeManager={colorModeManager}
      config={NATIVE_BASE_CONFIG}
    >
      <Beep />
    </NativeBaseProvider>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <App2 />
    </ApolloProvider>
  );
}

export default App;
