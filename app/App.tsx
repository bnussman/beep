import "react-native-gesture-handler";
import React, { useEffect } from "react";
import Sentry from "./utils/Sentry";
import RegisterScreen from "./routes/auth/Register";
import LoginScreen from "./routes/auth/Login";
import init from "./utils/Init";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import { ForgotPasswordScreen } from "./routes/auth/ForgotPassword";
import { ProfileScreen } from "./routes/global/Profile";
import { ReportScreen } from "./routes/global/Report";
import { RateScreen } from "./routes/global/Rate";
import { client } from "./utils/Apollo";
import { ApolloProvider, gql, useQuery } from "@apollo/client";
import { UserDataQuery } from "./generated/graphql";
import { extendTheme, NativeBaseProvider, useColorMode } from "native-base";
import { BeepDrawer } from "./navigators/Drawer";
import { colorModeManager } from "./utils/theme";
import { PickBeepScreen } from "./routes/ride/PickBeep";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { updatePushToken } from "./utils/Notifications";

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
    useSystemColorMode: true,
    initialColorMode: "dark",
  },
});

export const UserData = gql`
  query UserData {
    getUser {
      id
      username
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
      cashapp
    }
  }
`;

export const UserSubscription = gql`
  subscription UserUpdates {
    getUserUpdates {
      id
      username
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
      cashapp
    }
  }
`;

function Beep() {
  const { colorMode } = useColorMode();
  const { data, loading, subscribeToMore } = useQuery<UserDataQuery>(UserData, {
    errorPolicy: "none",
  });

  useEffect(() => {
    if (data?.getUser?.id) {
      subscribeToMore({
        document: UserSubscription,
        updateQuery: (prev, { subscriptionData }) => {
          // @ts-expect-error we are correct
          const newFeedItem = subscriptionData.data.getUserUpdates;
          // console.log("old", prev.getUser.photoUrl);
          // console.log("new", subscriptionData.data.getUserUpdates.photoUrl);
          return Object.assign({}, prev, {
            getUser: newFeedItem,
          });
        },
      });

      updatePushToken();
    }
  }, [data?.getUser?.id]);

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
    </>
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
