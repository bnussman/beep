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
import { Cars } from "../routes/cars/Cars";
import { Premium } from "../routes/Premium";
import { StartBeepingScreen } from "../routes/beep/StartBeeping";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { queryClient, useTRPC } from "@/utils/trpc";
import { printStars } from "@/components/Stars";
import { LOCATION_TRACKING } from "@/utils/location";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Pressable, Appearance, View, ActivityIndicator } from "react-native";
import { useTheme } from "@/utils/theme";
import {
  Button as IOSButton,
  Host,
  HStack,
  Spacer,
  Image as IOSImage,
} from "@expo/ui/swift-ui";
import {
  fixedSize,
  padding,
  frame,
  cornerRadius,
} from "@expo/ui/swift-ui/modifiers";
import { useMutation } from "@tanstack/react-query";
import { RideMenu } from "@/routes/ride/RideMenu";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const trpc = useTRPC();
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

  const rating = new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
  }).format(Number(user?.rating ?? 0));

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ gap: 12 }}>
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
            {user?.rating && (
              <Text color="subtle" size="xs">
                {printStars(Number(user.rating))} ({rating})
              </Text>
            )}
          </View>
          <Avatar src={user?.photo ?? undefined} />
        </View>
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
      header: ({}) => (
        <View>
          <Host>
            <HStack modifiers={[padding({ horizontal: 12 })]}>
              <IOSButton variant="glass" modifiers={[fixedSize()]}>
                <IOSImage
                  systemName="line.3.horizontal"
                  modifiers={[
                    frame({
                      height: 40,
                      width: 32,
                      alignment: "center",
                    }),
                  ]}
                />
              </IOSButton>
              <Spacer />
              <IOSButton variant="glass" modifiers={[fixedSize()]}>
                <IOSImage
                  systemName="ellipsis"
                  modifiers={[
                    // cornerRadius(32 / 2),
                    frame({
                      height: 40,
                      width: 32,
                      alignment: "center",
                    }),
                  ]}
                />
              </IOSButton>
            </HStack>
          </Host>
        </View>
      ),
    };
  },
  drawerContent: (props: DrawerContentComponentProps) => (
    <CustomDrawerContent {...props} />
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
