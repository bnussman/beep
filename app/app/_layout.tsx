import "react-native-gesture-handler";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { NativeBaseProvider, useColorMode } from "native-base";
import { colorModeManager } from "../utils/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NATIVE_BASE_THEME } from "../utils/constants";
import config from "../package.json";
import * as Sentry from "sentry-expo";
import { setupPurchase } from "../utils/purchase";
import { SplashScreen, Stack } from "expo-router";
import { client } from "../utils/Apollo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();
Sentry.init({
  release: config.version,
  dsn: "https://22da81efd1744791aa86cfd4bf8ea5eb@o1155818.ingest.sentry.io/6358990",
  enableInExpoDevelopment: true,
  enableAutoSessionTracking: true,
  enableAutoPerformanceTracing: true,
});

setupPurchase();

function Beep() {
  const { colorMode } = useColorMode();

  return (
    <ThemeProvider value={colorMode === "dark" ? DarkTheme: DefaultTheme}>
      <StatusBar style={colorMode === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
