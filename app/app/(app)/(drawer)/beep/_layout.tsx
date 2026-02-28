import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, headerShown: false  }}>
      <Stack.Screen name="index" options={{ headerTitle: "Beep" }} />
      <Stack.Screen name="queue" options={{ presentation: 'pageSheet', headerShown: true, sheetAllowedDetents: 'fitToContents' }} />
    </Stack>
  );
}