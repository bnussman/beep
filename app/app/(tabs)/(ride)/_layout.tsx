import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { RideMenu } from "@/components/RideMenu";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { isAndroid, isWeb } from "@/utils/constants";
import { Stack, useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

export default function Layout() {
  const params = useLocalSearchParams<{
    groupSize?: string;
    origin?: string;
    destination?: string;
  }>();

  const rideForm = useForm({
    values: {
      groupSize: params.groupSize ? String(params.groupSize) : "",
      origin: params.origin ?? "",
      destination: params.destination ?? "",
    },
  });

  return (
    <FormProvider {...rideForm}>
      <Stack
        screenOptions={{
          headerTransparent: true,
          contentStyle: isWeb ? { paddingTop: 72 } : {},
        }}
      >
        <Stack.Screen
          name="ride/index"
          options={{
            headerTitle: "Ride",
            ...(isWeb || isAndroid ? { headerRight: () => <RideMenu /> } : {}),
          }}
        />
        <Stack.Screen
          options={(route) => {
            const params = route.route.params as {
              type: "origin" | "destination";
            };

            return {
              headerTitle: `${pickLocationTitleMap[params.type]} Location`,
              presentation: "formSheet",
            };
          }}
          name="ride/pick-location"
        />
        <Stack.Screen name="ride/map" options={{ headerTitle: "Beeper Map" }} />
        <Stack.Screen
          name="ride/pick"
          options={{ headerTitle: "Choose Beeper" }}
        />
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
              headerTitle: "User",
            };
          }}
          name="user/[id]/index"
        />
        <Stack.Screen
          options={{ headerTitle: "Report" }}
          name="user/[id]/report"
        />
        <Stack.Screen options={{ headerTitle: "Rate" }} name="user/[id]/rate" />
      </Stack>
    </FormProvider>
  );
}

const pickLocationTitleMap = {
  origin: "Pick Up",
  destination: "Destination",
};
