import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { cache, client } from "./utils/Apollo";
import { ApolloProvider, useQuery, useSubscription } from "@apollo/client";
import { UserDataQuery, UserUpdatesSubscription } from "./generated/graphql";
import { updatePushToken } from "./utils/Notifications";
import { UserData, UserSubscription } from "./utils/useUser";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setUserContext } from "./utils/sentry";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import packageJson from "./package.json";
import * as Sentry from "sentry-expo";
import { setPurchaseUser, setupPurchase } from "./utils/purchase";
import { TamaguiProvider, Theme } from 'tamagui'
import config from './tamagui.config'
import { useColorScheme } from "react-native";
import { Navigation } from "./utils/Navigation";

SplashScreen.preventAutoHideAsync();
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
      <Navigation
        linking={{ enabled: true, prefixes: ["beep://", "https://app.ridebeep.app"] }}
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      />
    </Theme>
  );
}

export default function App() {
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
