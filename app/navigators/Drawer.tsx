import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainFindBeepScreen } from "../routes/ride/FindBeep";
import { Feedback } from "../routes/feedback/Feedback";
import { RatingsScreen } from "../routes/Ratings";
import { BeepsScreen } from "../routes/Beeps";
import { EditProfileScreen } from "../routes/settings/EditProfile";
import { gql, useMutation } from "@apollo/client";
import { client } from "../utils/Apollo";
import { useIsUserNotBeeping, useUser } from "../utils/useUser";
import { Avatar } from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Cars } from "../routes/cars/Cars";
import { Premium } from "../routes/Premium";
import {
  LOCATION_TRACKING,
  StartBeepingScreen,
} from "../routes/beep/StartBeeping";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  Stack,
  Text,
  XStack,
  Spinner,
  Button,
  Card,
} from "@beep/ui";
import { Pressable, useColorScheme } from "react-native";
import { Car, CarTaxiFront, Crown, HelpCircle, LogOut, Star, User } from "@tamagui/lucide-icons";

const Logout = gql`
  mutation Logout {
    logout(isApp: true)
  }
`;

const getIcon = (screenName: string) => {
  switch (screenName) {
    case "Ride":
      return Car;
    case "Beep":
      return CarTaxiFront;
    case "Profile":
      return User;
    case "Beeps":
      return Car;
    case "Ratings":
      return Star;
    case "My Cars":
      return Car;
    case "Feedback":
      return HelpCircle;
    case "Premium":
      return Crown;
    default:
      return Car;
  }
};

const Resend = gql`
  mutation Resend {
    resendEmailVarification
  }
`;

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useUser();
  const { navigate } = useNavigation();
  const [logout, { loading }] = useMutation(Logout);
  const [resend, { loading: resendLoading }] = useMutation(Resend);

  const handleLogout = async () => {
    await logout({
      variables: {
        isApp: true,
      },
    });

    AsyncStorage.clear();

    if (!__DEV__) {
      Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }

    client.resetStore();
  };

  const handleResendVerification = () => {
    resend()
      .then(() =>
        alert(
          "Successfully resent verification email. Please check your email for further instructions."
        )
      )
      .catch((error) => alert(error.message));
  };

  return (
    <DrawerContentScrollView {...props}>
      <Stack gap="$4" my="$2" mx="$2">
        <Pressable onPress={() => navigate("User", { id: user?.id ?? "" })}>
          <XStack alignItems="center">
            <Avatar
              mr={2}
              size="md"
              url={user?.photo}
              online={user?.isBeeping}
            />
            <Stack flexShrink={1}>
              <Text fontWeight="bold">
                {user?.name}
              </Text>
              <Text color="$gray10">
                @{user?.username}
              </Text>
            </Stack>
            {/*
            <Spacer />
            <Text fontSize="3xl" px={2}>🎄</Text>
            */}
          </XStack>
        </Pressable>
        <Stack gap="$4">
          <Stack gap="$3">
            {!user?.isEmailVerified ? (
              <Button
                theme="red"
                iconAfter={resendLoading ? <Spinner /> : null}
                onPress={handleResendVerification}
              >
                Resend Verification Email
              </Button>
            ) : null}
            {props.state.routeNames.map((name: string, index: number) => {
              const Icon = getIcon(name);
              return (
                <Pressable>
                  <Stack
                    key={index}
                    px="$5"
                    py="$3"
                    borderRadius="$4"
                    bg={
                      index === props.state.index
                        ? "rgba(143, 143, 143, 0.1)"
                        : "transparent"
                    }
                    onPress={() => {
                      props.navigation.navigate(name);
                    }}
                  >
                    <XStack gap="$7" alignItems="center">
                      <Icon />
                      <Text>{name}</Text>
                      {name === "Premium" && (
                        <Card borderRadius="$4" backgroundColor="$yellow8" px="$2">
                          <Text>New</Text>
                        </Card>
                      )}
                    </XStack>
                  </Stack>
                </Pressable>
              );
            })}
            <Pressable onPress={handleLogout}>
              <XStack px="$5" py="$3" gap="$7" alignItems="center">
                {loading ? (
                  <Spinner />
                ) : (
                  <LogOut />
                )}
                <Text mr="$4">
                  Logout
                </Text>
              </XStack>
            </Pressable>
          </Stack>
        </Stack>
      </Stack>
    </DrawerContentScrollView>
  );
}

export const Drawer = createDrawerNavigator({
  screenOptions: () => {
    const colorScheme = useColorScheme();
    return {
      headerTintColor: colorScheme === "dark" ? "white" : "black",
      drawerType: "front",
    }
  },
  drawerContent: (props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />,
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
