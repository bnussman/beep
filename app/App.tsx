import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { LoginScreen } from "./routes/auth/Login";
import { createStackNavigator } from "@react-navigation/stack";
import { ForgotPasswordScreen } from "./routes/auth/ForgotPassword";
import { ProfileScreen } from "./routes/global/Profile";
import { ReportScreen } from "./routes/global/Report";
import { RateScreen } from "./routes/global/Rate";
import { cache, client } from "./utils/Apollo";
import { ApolloProvider, useQuery, useSubscription } from "@apollo/client";
import { UserDataQuery, UserUpdatesSubscription } from "./generated/graphql";
import { BeepDrawer } from "./navigators/Drawer";
import { PickBeepScreen } from "./routes/ride/PickBeep";
import { updatePushToken } from "./utils/Notifications";
import { SignUpScreen } from "./routes/auth/SignUp";
import { UserData, UserSubscription } from "./utils/useUser";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setUserContext } from "./utils/sentry";
import { StatusBar } from "expo-status-bar";
import { AddCar } from "./routes/cars/AddCar";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { ChangePasswordScreen } from "./routes/settings/ChangePassword";
import * as SplashScreen from "expo-splash-screen";
import packageJson from "./package.json";
import * as Sentry from "sentry-expo";
import { setPurchaseUser, setupPurchase } from "./utils/purchase";
// import '@tamagui/core/reset.css'
import { TamaguiProvider, Theme } from 'tamagui'
import config from './tamagui.config'
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();
Sentry.init({
  release: packageJson.version,
  dsn: "https://22da81efd1744791aa86cfd4bf8ea5eb@o1155818.ingest.sentry.io/6358990",
  enableInExpoDevelopment: true,
  enableAutoSessionTracking: true,
  enableAutoPerformanceTracing: true,
});

setupPurchase();

function Beep() {
  const colorScheme = useColorScheme();
  const { data, loading } = useQuery<UserDataQuery>(UserData, {
    errorPolicy: "none",
    onCompleted: () => {
      updatePushToken();
    },
  });

  const user = data?.getUser;

  useSubscription<UserUpdatesSubscription>(UserSubscription, {
    onData({ data }) {
      cache.updateQuery<UserDataQuery>({ query: UserData }, () => ({ getUser: data.data!.getUserUpdates }));
    },
    skip: !user,
  });

  useEffect(() => {
    if (user) {
      setPurchaseUser(user);
      setUserContext(user);
    }
  }, [user]);

  if (loading) {
    return null;
  }

  return (
    <Theme name={colorScheme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <NavigationContainer
        linking={{ enabled: true, prefixes: ["beep://", "https://app.ridebeep.app"] }}
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack.Navigator
          initialRouteName={user ? "Main" : "Login"}
          screenOptions={{
            headerTintColor: colorScheme === "dark" ? "white" : "black",
          }}
        >
          {!user ? (
            <>
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
            </>
          ) : (
            <>
              <Stack.Screen
                options={{ headerShown: false }}
                name="Main"
                component={BeepDrawer}
              />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen
                name="Report"
                component={ReportScreen}
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="Rate"
                component={RateScreen}
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="Change Password"
                component={ChangePasswordScreen}
              />
              <Stack.Screen name="Choose Beeper" component={PickBeepScreen} />
              <Stack.Screen name="Add Car" component={AddCar} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Theme>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <ApolloProvider client={client}>
          <Beep />
        </ApolloProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

export default App;
