import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { isWeb } from "@/utils/constants";
import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, contentStyle: isWeb ? { paddingTop: 72 } : {} }}>
      <Stack.Screen name="beep/index" options={{ headerTitle: "Beep" }} />
      <Stack.Screen name="beep/queue" options={{ headerTitle: "Queue" }} />
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
            headerTitle: "User"
          }
        }}
        name="user/[id]/index"
      />
      <Stack.Screen options={{ headerTitle: "Report" }} name="user/[id]/report" />
      <Stack.Screen options={{ headerTitle: "Rate" }} name="user/[id]/rate" />
    </Stack>
  );
}

export const unstable_settings = {
  initialRouteName: 'beep/index',
};