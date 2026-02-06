import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}