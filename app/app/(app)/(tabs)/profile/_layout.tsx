import { AddCarButton } from "@/components/AddCarButton";
import { Menu } from "@/components/Menu";
import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { useProfileMenu } from "@/components/ProfileMenu"
import { isWeb } from "@/utils/constants";
import { Stack } from "expo-router"

export default function Layout() {
  const menu = useProfileMenu();

  return (
    <Stack screenOptions={{ headerTransparent: true, contentStyle: isWeb ? { paddingTop: 72 } : {} }}>
      <Stack.Screen name="index" options={{ headerTitle: "Profile" }} />
      <Stack.Screen name="premium" options={{ headerTitle: "Premium" }} />
      <Stack.Screen name="edit" options={{ headerTitle: 'Edit', unstable_headerRightItems: () => getNavigationMenuFromOptions(menu), headerRight: () => <Menu trigger="..." options={menu} /> }} />
      <Stack.Screen name="change-password" options={{ headerTitle: 'Change Password' }} />
      <Stack.Screen name="cars/index" options={{ headerTitle: "Cars", headerRight: () => <AddCarButton /> }} />
      <Stack.Screen name="cars/create" options={{ headerTitle: "Add Car" }} />
      <Stack.Screen name="beeps/index" options={{ headerTitle: "Beeps" }} />
      <Stack.Screen name="ratings" options={{ headerTitle: "Ratings" }} />
      <Stack.Screen name="user/[id]/index" options={{ headerTitle: "User" }} />
    </Stack>
  );
}