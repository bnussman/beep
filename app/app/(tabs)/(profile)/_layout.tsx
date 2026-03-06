import { AddCarButton } from "@/components/AddCarButton";
import { Menu } from "@/components/Menu";
import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { useProfileMenu } from "@/components/ProfileMenu"
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { isWeb } from "@/utils/constants";
import { Stack } from "expo-router"

export default function Layout() {
  const menu = useProfileMenu();

  return (
    <Stack screenOptions={{ headerTransparent: true, contentStyle: isWeb ? { paddingTop: 72 } : {} }}>
      <Stack.Screen name="profile/index" options={{ headerTitle: "Profile" }} />
      <Stack.Screen name="profile/premium" options={{ headerTitle: "Premium" }} />
      <Stack.Screen name="profile/edit" options={{ headerTitle: 'Edit', unstable_headerRightItems: () => getNavigationMenuFromOptions(menu), headerRight: () => <Menu trigger="..." options={menu} /> }} />
      <Stack.Screen name="profile/change-password" options={{ headerTitle: 'Change Password' }} />
      <Stack.Screen name="profile/cars/index" options={{ headerTitle: "Cars", headerRight: () => <AddCarButton /> }} />
      <Stack.Screen name="profile/cars/create" options={{ headerTitle: "Add Car" }} />
      <Stack.Screen name="profile/beeps/index" options={{ headerTitle: "Beeps" }} />
      <Stack.Screen name="profile/beeps/[id]" options={{ headerTitle: "Beep" }} />
      <Stack.Screen name="profile/ratings" options={{ headerTitle: "Ratings" }} />
      <Stack.Screen name="profile/feedback" options={{ headerTitle: "Feedback" }} />
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