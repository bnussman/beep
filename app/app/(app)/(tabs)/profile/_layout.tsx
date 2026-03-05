import { AddCarButton } from "@/components/AddCarButton";
import { Menu } from "@/components/Menu";
import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { useProfileMenu } from "@/components/ProfileMenu"
import { Stack } from "expo-router"

export default function Layout() {
  const menu = useProfileMenu();

  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen name="index" options={{ headerTitle: "Profile" }} />
      <Stack.Screen name="edit" options={{ unstable_headerRightItems: () => getNavigationMenuFromOptions(menu), headerRight: () => <Menu trigger="..." options={menu} /> }} />
      <Stack.Screen name="cars/index" options={{headerRight: () => <AddCarButton /> }} />
    </Stack>
  );
}