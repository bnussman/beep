import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="(drawer)" />
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
        }}}
        name="user/[id]/index"
      />
    </Stack>
  );
}
