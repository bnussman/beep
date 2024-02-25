import "react-native-gesture-handler";
import React, { useEffect } from "react";
import config from "./package.json";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { cache, client } from "./utils/Apollo";
import { ApolloProvider, useSubscription } from "@apollo/client";
import { NativeBaseProvider, useColorMode } from "native-base";
import { colorModeManager } from "./utils/theme";
import { updatePushToken } from "./utils/Notifications";
import { UserData, UserSubscription, useUser } from "./utils/useUser";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setUserContext } from "./utils/sentry";
import { StatusBar } from "expo-status-bar";
import { NATIVE_BASE_THEME } from "./utils/constants";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { setPurchaseUser, setupPurchase } from "./utils/purchase";
import { Navigation } from "./utils/Navigation";
import { useAutoUpdate } from "./utils/updates";
import { TamaguiProvider, tamaguiConfig } from "@beep/ui";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();
Sentry.init({
  release: config.version,
  dsn: "https://22da81efd1744791aa86cfd4bf8ea5eb@o1155818.ingest.sentry.io/6358990",
  enableAutoSessionTracking: true,
  enableAutoPerformanceTracing: true,
});

setupPurchase();

function Beep() {
  const colorScheme = useColorScheme();
  const { data, loading } = useUser({
    errorPolicy: "none",
    onCompleted: () => {
      updatePushToken();
    },
  });

  useAutoUpdate();

  const user = data?.getUser;

  useSubscription(UserSubscription, {
    onData({ data }) {
      cache.updateQuery({ query: UserData }, () => ({ getUser: data.data!.getUserUpdates }));
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
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Navigation
        linking={{ enabled: true, prefixes: ["beep://", "https://app.ridebeep.app"] }}
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      />
    </>
  );
}

function App() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme  ?? "light"}>
        <NativeBaseProvider
          theme={NATIVE_BASE_THEME}
          colorModeManager={colorModeManager}
          config={{
            dependencies: {
              "linear-gradient": require("expo-linear-gradient").LinearGradient,
            },
          }}
        >
          <ApolloProvider client={client}>
            <Beep />
          </ApolloProvider>
        </NativeBaseProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
