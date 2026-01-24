import React, { useEffect } from "react";
import config from "./package.json";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { setupNotifications, updatePushToken } from "./utils/notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { setPurchaseUser, setupPurchase } from "./utils/purchase";
import { Navigation } from "./navigators/Stack";
import { useAutoUpdate } from "./utils/updates";
import { useColorScheme } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "./utils/orpc";
import { queryClient } from "./utils/tanstack-query";

setupPurchase();
setupNotifications();

SplashScreen.preventAutoHideAsync();

Sentry.init({
  release: config.version,
  dsn: "https://22da81efd1744791aa86cfd4bf8ea5eb@o1155818.ingest.sentry.io/6358990",
  enableAutoSessionTracking: true,
  enableAutoPerformanceTracing: true,
});

function Beep() {
  const colorScheme = useColorScheme();

  const { data: user, isLoading } = useQuery(
    orpc.user.updates.experimental_liveOptions({
      retry(failureCount, error) {
        return error.message !== "Unauthorized";
      },
      refetchOnWindowFocus: false,
    })
  );

  useAutoUpdate();

  useEffect(() => {
    if (user) {
      Sentry.setUser(user);
      updatePushToken();
      setPurchaseUser(user);
    }
  }, [user]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Navigation
        linking={{
          enabled: "auto",
          prefixes: ["beep://", "https://app.ridebeep.app"],
        }}
        theme={
          colorScheme === "dark"
            ? DarkTheme
            : {
                ...DefaultTheme,
                colors: { ...DefaultTheme.colors, background: "white" },
              }
        }
      />
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <Beep />
        </QueryClientProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
