import { Stack, Slot } from "expo-router"

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTransparent: true, headerTitle: "Ride" }} />
  );
}