import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router/stack";
import { NativeBaseProvider, useColorMode } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { client } from "../utils/Apollo";
import { NATIVE_BASE_THEME } from "../utils/constants";
import { colorModeManager } from "../utils/theme";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";

function App() {
  const { colorMode } = useColorMode();

  const reactNavigationTheme = colorMode === "dark" ? DarkTheme : DefaultTheme;
  const headerTintColor = colorMode === "dark" ? "white" : "black";

  return (
    <ThemeProvider value={reactNavigationTheme}>
      <Stack screenOptions={{ headerTintColor }} initialRouteName="login" />
    </ThemeProvider>
  );
}

export default function Layout() {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeBaseProvider
          theme={NATIVE_BASE_THEME}
          colorModeManager={colorModeManager}
        >
          <App />
        </NativeBaseProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}
