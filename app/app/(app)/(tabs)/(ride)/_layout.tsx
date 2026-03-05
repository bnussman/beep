import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { RideMenu } from "@/components/RideMenu";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { isAndroid, isWeb } from "@/utils/constants";
import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, contentStyle: isWeb ? { paddingTop: 72 } : {} }}>
      <Stack.Screen
        name="ride/index"
        options={{
          headerTitle: "Ride",
          ...(isWeb || isAndroid ? { headerRight: () => <RideMenu /> } : {})
        }}
      />
      <Stack.Screen name="ride/map" options={{ headerTitle: "Beeper Map" }} />
      <Stack.Screen name="ride/pick" options={{ headerTitle: "Choose Beeper" }} />
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
    </Stack>
  );
}