import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{
      headerBackButtonDisplayMode: 'generic',
    }}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="(tabs)"
      />
      <Stack.Screen
        options={{ headerTitle: "Report", presentation: 'formSheet' }}
        name="user/[id]/report"
      />
      <Stack.Screen
        options={{ headerTitle: "Rate", presentation: 'formSheet' }}
        name="user/[id]/rate"
      />
    </Stack>
  );
}

export const unstable_settings = {
  initialRouteName: '(tabs)',
};
