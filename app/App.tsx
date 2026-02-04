import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { setupNotifications, updatePushToken } from "./utils/notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { createNavigationContainerRef, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { setPurchaseUser, setupPurchase } from "./utils/purchase";
import { Navigation } from "./navigators/Stack";
import { useAutoUpdate } from "./utils/updates";
import { useColorScheme } from "react-native";
import { useTRPC, queryClient, trpcClient, TRPCProvider } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { navigationIntegration } from "./utils/instrument";

SplashScreen.preventAutoHideAsync();

setupPurchase();
setupNotifications();

function Beep() {
  const containerRef = createNavigationContainerRef();
  const trpc = useTRPC();
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery(
    trpc.user.me.queryOptions(undefined, {
      retry: false,
    }),
  );

  useAutoUpdate();

  useSubscription(
    trpc.user.updates.subscriptionOptions(undefined, {
      enabled: user !== undefined,
      onData(user) {
        queryClient.setQueryData(trpc.user.me.queryKey(), user);
      },
    }),
  );

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
        ref={containerRef}
        onReady={() => navigationIntegration.registerNavigationContainer(containerRef)}
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
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Beep />
          </QueryClientProvider>
        </TRPCProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
