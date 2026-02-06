import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsUserNotBeeping, useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { queryClient, useTRPC } from "@/utils/trpc";
import { printStars } from "@/components/Stars";
import { LOCATION_TRACKING } from "@/utils/location";
import { Pressable, Appearance, View, ActivityIndicator } from "react-native";
import { useTheme } from "@/utils/theme";
import { useMutation } from "@tanstack/react-query";
import { AddCarButton } from "@/components/AddCarButton";
import { ProfileMenu } from "@/components/ProfileMenu";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { RideMenu } from "@/components/RideMenu";
import MainFindBeepScreen from "@/app/(app)/(drawer)/ride";
import BeepsScreen from "@/app/(app)/(drawer)/beeps";
import RatingsScreen from "@/app/(app)/(drawer)/ratings";
import Cars from "@/app/(app)/(drawer)/cars";
import Premium from "@/app/(app)/(drawer)/premium";
import EditProfileScreen from "@/app/(app)/(drawer)/profile";
import Feedback from "@/app/(app)/(drawer)/feedback";
import StartBeepingScreen from "@/app/(app)/(drawer)/beep";

export function BeepDrawer(props: DrawerContentComponentProps) {
  const trpc = useTRPC();
  const navigation = useNavigation();
  const { user } = useUser();
  const { mutateAsync: logout, isPending } = useMutation(
    trpc.auth.logout.mutationOptions(),
  );
  const { mutateAsync: resend, isPending: resendLoading } = useMutation(
    trpc.auth.resendVerification.mutationOptions(),
  );

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

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ gap: 12 }}>
        <Pressable
          onPress={() => navigation.navigate("User", { id: user?.id ?? "" })}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexShrink: 1 }}>
              <Text size="xl" weight="800">
                {user?.first} {user?.last}
              </Text>
              <Text size="xs" color="subtle" weight="300">
                {user?.email}
              </Text>
            </View>
            <Avatar src={user?.photo ?? undefined} />
          </View>
        </Pressable>
        <View style={{ display: "flex", gap: 8 }}>
          {!user?.isEmailVerified && (
            <Button
              onPress={handleResendVerification}
              isLoading={resendLoading}
            >
              Resend Verification Email
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
          <DrawerItem
            name="Logout"
            onPress={handleLogout}
            isLoading={isPending}
            isActive={false}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export const Drawer = createDrawerNavigator({
  screenOptions: () => {
    const colorScheme = Appearance.getColorScheme();
    return {
      headerBackButtonDisplayMode: "generic",
      headerTintColor: colorScheme === "dark" ? "white" : "black",
      drawerType: "front",
    };
  },
  drawerContent: (props) => (
    <BeepDrawer {...props} />
  ),
  screens: {
    Ride: {
      screen: MainFindBeepScreen,
      if: useIsUserNotBeeping,
      options: {
        headerRight: () => <RideMenu />,
      },
    },
    Beep: StartBeepingScreen,
    Cars: {
      screen: Cars,
      options: {
        headerRight: () => <AddCarButton />,
      },
    },
    Premium: Premium,
    Profile: {
      screen: EditProfileScreen,
      options: {
        headerRight: () => <ProfileMenu />,
      },
    },
    Beeps: BeepsScreen,
    Ratings: RatingsScreen,
    Feedback: Feedback,
  },
});

interface Props {
  name: string;
  onPress: () => void;
  isActive: boolean;
  isLoading?: boolean;
}

function DrawerItem(props: Props) {
  const { name, onPress, isActive, isLoading } = props;

  const theme = useTheme();

  const getIcon = (screenName: string) => {
    if (isLoading) {
      return <ActivityIndicator size="small" />;
    }
    switch (screenName) {
      case "Logout":
        return <Text size="lg">↩️</Text>;
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
      onPress={onPress}
      style={({ pressed }) => [
        {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          padding: 12,
          borderRadius: 8,
        },
        (isActive || pressed) && {
          backgroundColor: theme.name === "dark" ? "#202020ff" : "#ebebeb91",
        },
      ]}
    >
      {Icon}
      <Text>{name}</Text>
    </Pressable>
  );
}
