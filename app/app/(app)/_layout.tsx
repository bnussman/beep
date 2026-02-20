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
        name="(drawer)"
      />
      <Stack.Screen
        options={{ headerTransparent: true, title: '' }}
        name="beeps/[id]"
      />
      <Stack.Screen
        options={(route) => {
          const params = route.route.params as { id: string };
          return {
            headerRight: () => {
              return <UserMenu userId={params.id} />;
            },
            unstable_headerRightItems: () => {
              const options = useUserMenuOptions(params.id);
              return getNavigationMenuFromOptions(options);
            },
            headerBackButtonDisplayMode: 'minimal',
          }
        }}
        name="user/[id]/index"
      />
      <Stack.Screen
        options={{ headerTitle: "Change Password"}}
        name="profile/change-password"
      />
      <Stack.Screen
        options={{ headerTitle: "Create Car" }}
        name="cars/create"
      />
      <Stack.Screen
        options={{ headerTitle: "Report" }}
        name="user/[id]/report"
      />
      <Stack.Screen
        options={{ headerTitle: "Rate" }}
        name="user/[id]/rate"
      />
    </Stack>
  );
}

export const unstable_settings = {
  initialRouteName: '(drawer)',
};
