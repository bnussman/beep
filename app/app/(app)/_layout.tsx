import { CustomDrawerContent } from '@/navigators/Drawer';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        headerBackButtonDisplayMode: "generic",
        headerTintColor: colorScheme === "dark" ? "white" : "black",
        drawerType: "front",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}