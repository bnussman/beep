import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="(drawer)" />
      <Stack.Screen
        options={(route) => ({
          headerRight: () => {
            console.log("ROUTE", route)
            return <UserMenu userId={route.route.params.id} />;
          },
          unstable_headerRightItems: () => {
            const options = useUserMenuOptions(
              route.route.params.id,
            );
            return getNavigationMenuFromOptions(options);
          },
        })}
        name="user/[id]"
      />
    </Stack>
  );
}
