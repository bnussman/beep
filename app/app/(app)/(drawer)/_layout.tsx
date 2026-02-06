import { AddCarButton } from '@/components/AddCarButton';
import { BeepDrawer } from '@/components/Drawer';
import { ProfileMenu } from '@/components/ProfileMenu';
import { RideMenu } from '@/components/RideMenu';
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
      drawerContent={(props) => <BeepDrawer {...props} />}
    >
      <Drawer.Screen
        options={{ headerRight: () => <RideMenu />, headerTitle: "Ride" }}
        name="ride"
      />
      <Drawer.Screen
        options={{ headerTitle: "Beep" }}
        name="beep"
      />
      <Drawer.Screen
        options={{ headerRight: () => <AddCarButton />, headerTitle: "Cars" }}
        name="cars"
      />
      <Drawer.Screen
        options={{ headerTitle: "Premium" }}
        name="premium"
      />
      <Drawer.Screen
        options={{ headerRight: () => <ProfileMenu />, headerTitle: "Profile" }}
        name="profile"
      />
      <Drawer.Screen
        options={{ headerTitle: "Beeps" }}
        name="beeps"
      />
      <Drawer.Screen
        options={{ headerTitle: "Ratings" }}
        name="ratings"
      />
      <Drawer.Screen
        options={{ headerTitle: "Feedback" }}
        name="feedback"
      />
    </Drawer>
  );
}