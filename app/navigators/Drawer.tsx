import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainFindBeepScreen } from "../routes/ride/FindBeep";
import { Feedback } from "../routes/feedback/Feedback";
import { RatingsScreen } from "../routes/Ratings";
import { BeepsScreen } from "../routes/Beeps";
import { EditProfileScreen } from "../routes/settings/EditProfile";
import { useIsUserNotBeeping, useUser } from "../utils/useUser";
import { Avatar } from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Cars } from "../routes/cars/Cars";
import { Premium } from "../routes/Premium";
import {
  StartBeepingScreen,
} from "../routes/beep/StartBeeping";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  Pressable,
  Appearance,
  View,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { cx } from "class-variance-authority";
import { queryClient, trpc } from "@/utils/trpc";
import { printStars } from "@/components/Stars";
import { LOCATION_TRACKING } from "@/utils/location";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useUser();
  const { navigate } = useNavigation();
  const { mutateAsync: logout, isPending } = trpc.auth.logout.useMutation();
  const { mutateAsync: resend, isPending: resendLoading } = trpc.auth.resendVerification.useMutation();

  const handleLogout = async () => {
    await logout({
      isApp: true,
    });

    AsyncStorage.clear();

    if (!__DEV__) {
      Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }

    queryClient.resetQueries();
  };

  const handleResendVerification = () => {
    resend()
      .then(() =>
        alert(
          "Successfully resent verification email. Please check your email for further instructions.",
        ),
      )
      .catch((error) => alert(error.message));
  };

  const rating = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format(
    Number(user?.rating ?? 0),
  )

  return (
    <DrawerContentScrollView {...props}>
      <View className="gap-3">
        <View className="flex flex-row items-center justify-between px-2">
          <View className="flex-shrink">
            <Text size="xl" weight="black">
              {user?.first} {user?.last}
            </Text>
            {user?.rating && (
              <Text color="subtle" size="sm">{printStars(Number(user.rating))} ({rating})</Text>
            )}
          </View>
          <Avatar src={user?.photo ?? undefined} />
        </View>
        <View className="flex gap-3">
          {!user?.isEmailVerified && (
            <Button
              onPress={handleResendVerification}
              className="text-gray-50 !bg-red-400 active:!bg-red-500"
              isLoading={resendLoading}
              activityIndicatorProps={{ color: "white" }}
            >
              <Text className="text-white" weight="black">Resend Verification Email</Text>
            </Button>
          )}
          {props.state.routeNames.map((name, index) => (
            <DrawerItem
              name={name}
              key={name}
              onPress={() => props.navigation.navigate(name)}
              isActive={index === props.state.index}
            />
          ))}
          <Pressable
            onPress={handleLogout}
            className="px-5 py-3 rounded-lg flex flex-row items-center gap-6 active:bg-gray-300/5"
          >
            {isPending ? (
              <ActivityIndicator />
            ) : (
              <Text style={{ fontSize: 18 }}>↩️</Text>
            )}
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export const Drawer = createDrawerNavigator({
  screenOptions: () => {
    const colorScheme = Appearance.getColorScheme();
    return {
      headerBackButtonDisplayMode: 'generic',
      headerTintColor: colorScheme === "dark" ? "white" : "black",
      drawerType: "front",
    };
  },
  drawerContent: (props: DrawerContentComponentProps) => (
    <CustomDrawerContent {...props} />
  ),
  screens: {
    Ride: {
      screen: MainFindBeepScreen,
      if: useIsUserNotBeeping,
    },
    Beep: StartBeepingScreen,
    Cars: Cars,
    Premium: Premium,
    Profile: EditProfileScreen,
    Beeps: BeepsScreen,
    Ratings: RatingsScreen,
    Feedback: Feedback,
  },
});

interface Props {
  name: string;
  onPress: () => void;
  isActive: boolean;
}

function DrawerItem(props: Props) {
  const { name, onPress, isActive } = props;

  const getIcon = (screenName: string) => {
    switch (screenName) {
      case "Ride":
        return <Text size="lg">🚗</Text>;
      case "Beep":
        return <Text size="lg">🚕</Text>;
      case "Profile":
        return <Text size="lg">👤</Text>;
      case "Beeps":
        return <Text size="lg">🚗</Text>;
      case "Ratings":
        return <Text size="lg">⭐</Text>;
      case "Cars":
        return <Text size="lg">🚙</Text>;
      case "Feedback":
        return <Text size="lg">💬</Text>;
      case "Premium":
        return (
          <Text
            size="lg"
            className="shadow-xl opacity-100 shadow-yellow-400"
            style={{
              shadowRadius: 10,
              shadowColor: "#f5db73",
              shadowOpacity: 1,
            }}
          >
            👑
          </Text>
        );
      default:
        return <Text size="lg">🚗</Text>;
    }
  };

  const Icon = getIcon(name);

  return (
    <Pressable
      className={cx(
        "px-5 py-3 rounded-lg flex flex-row items-center gap-6 active:bg-gray-600/5 active:dark:bg-gray-300/5",
        {
          "bg-gray-600/5 dark:bg-gray-300/5": isActive,
        },
      )}
      onPress={onPress}
    >
      {Icon}
      <Text>{name}</Text>
    </Pressable>
  );
}
