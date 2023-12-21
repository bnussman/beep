import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";

import { Stack } from 'expo-router';
import { NativeBaseProvider, useColorMode } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NATIVE_BASE_THEME } from "../utils/constants";
import { colorModeManager } from "../utils/theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "../utils/Apollo";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export function Beep() {
  const { colorMode } = useColorMode();
  return (
    <ThemeProvider value={colorMode === "dark" ? DarkTheme: DefaultTheme}>
      <StatusBar style={colorMode === "light" ? "dark" : "light"} />
      <Stack />
    </ThemeProvider >
  );
}

export default function App2() {
  return (
    <ApolloProvider client={client}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider
        theme={NATIVE_BASE_THEME}
        colorModeManager={colorModeManager}
      >
        <Beep />
      </NativeBaseProvider>
    </GestureHandlerRootView>
    </ApolloProvider>
  );
}
