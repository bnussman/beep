import "react-native-gesture-handler";
import React, { useEffect } from "react";
import config from "./package.json";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import * as Notifications from 'expo-notifications';
import { updatePushToken } from "./utils/notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { setPurchaseUser, setupPurchase } from "./utils/purchase";
import { Navigation } from "./navigators/Stack";
import { useAutoUpdate } from "./utils/updates";
import { useColorScheme } from "react-native";
import { trpc, queryClient, trpcClient, basicTrpcClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { isWeb } from "./utils/constants";
import "./global.css";

if (!isWeb) {
  Notifications.setNotificationCategoryAsync(
    "newbeep",
    [
      {
        identifier: "accept",
        buttonTitle: "Accept",
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: "deny",
        buttonTitle: "Deny",
        options: {
          isDestructive: true,
          opensAppToForeground: false,
        },
      },
    ],
    {
      allowInCarPlay: true,
      allowAnnouncement: true,
    },
  );
}

Notifications.addNotificationResponseReceivedListener((response) => {
  console.log(response.actionIdentifier);
  if (
    response.notification.request.content.categoryIdentifier === "newbeep" &&
    response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
  ) {
    basicTrpcClient.beeper.updateBeep.mutate({
      beepId: response.notification.request.content.data.id as string,
      data: {
        status: response.actionIdentifier === "accept"
        ? "accepted"
        : "denied"
      }
    })
  }
});

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
  const utils = trpc.useUtils();
  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    retry: false,
  });

  useAutoUpdate();

  trpc.user.updates.useSubscription(undefined, {
    enabled: user !== undefined,
    onData(user) {
      utils.user.me.setData(undefined, user);
    }
  });

  useEffect(() => {
    if (user) {
      Sentry.setUser(user);
      updatePushToken(user.pushToken);
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
        theme={colorScheme === "dark" ? DarkTheme : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'white' } }}
      />
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Beep />
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
