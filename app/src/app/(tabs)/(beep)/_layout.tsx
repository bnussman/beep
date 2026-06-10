import { getNavigationMenuFromOptions } from "@/components/Menu.utils";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { isAndroid, isWeb } from "@/utils/constants";
import { Stack, useRouter } from "expo-router";
import { CloseButton } from "heroui-native";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        contentStyle: isWeb ? { paddingTop: 72 } : {},
      }}
    >
      <Stack.Screen name="beep/index" options={{ headerTitle: "Beep" }} />
      <Stack.Screen name="beep/queue" options={{ headerTitle: "Queue" }} />
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
      <Stack.Screen
        options={{
          headerTitle: "Premium",
          presentation: isAndroid ? undefined : "formSheet", // formSheet causes a crash on android (java.lang.NullPointerException com.swmansion.rnscreens.ScreenStackFragment.handleInsetsUpdateAndNotifyTransition)
          unstable_headerRightItems: (context) => [
            {
              type: "button",
              label: "Close",
              icon: { name: "xmark", type: "sfSymbol" },
              onPress: () => router.back(),
            },
          ],
          headerRight: () => (
            <CloseButton className="mr-2" onPress={() => router.back()} />
          ),
        }}
        name="premium"
      />
    </Stack>
  );
}

export const unstable_settings = {
  initialRouteName: "beep/index",
};
