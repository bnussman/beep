import { RideMenu } from "@/components/RideMenu";
import { isAndroid, isWeb } from "@/utils/constants";
import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, contentStyle: isWeb ? { paddingTop: 72 } : {} }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Ride",
          ...(isWeb || isAndroid ? { headerRight: () => <RideMenu /> } : {})
        }}
      />
      <Stack.Screen name="map" options={{ headerTitle: "Beeper Map" }} />
      <Stack.Screen name="pick" options={{ headerTitle: "Choose Beeper" }} />
    </Stack>
  );
}