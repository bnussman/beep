import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { useProfileMenu } from "@/components/ProfileMenu"
import { Stack } from "expo-router"

export default function Layout() {
  const menu = useProfileMenu();

  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen name="index" options={{ unstable_headerRightItems: () => getNavigationMenuFromOptions(menu) }} />
    </Stack>
  );
}