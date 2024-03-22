import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainFindBeepScreen } from "../routes/ride/FindBeep";
import { Feedback } from "../routes/feedback/Feedback";
import { RatingsScreen } from "../routes/Ratings";
import { BeepsScreen } from "../routes/Beeps";
import { EditProfileScreen } from "../routes/settings/EditProfile";
import { gql, useMutation } from "@apollo/client";
import { client } from "../utils/apollo";
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
} from "@beep/ui";
import { Pressable, Appearance } from "react-native";
import { Car, CarTaxiFront, Crown, HelpCircle, LogOut, Star, User } from "@tamagui/lucide-icons";
import { LinearGradient } from 'tamagui/linear-gradient'

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
              mr="$3"
              size="$4.5"
              url={user?.photo}
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
                <Pressable key={name}>
                  <Stack
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
                    <XStack gap="$4" alignItems="center">
                      <Icon />
                      <Text>{name}</Text>
                      {name === "Premium" && (
                        <LinearGradient
                          borderRadius="$4"
                          backgroundColor="$yellow9"
                          px="$2"
                          colors={['$pink10', '$yellow10']}
                          start={[0, 1]}
                          end={[1, 0]}
                        >
                          <Text fontSize="$2" fontWeight="bold" color="white" zIndex={2}>New</Text>
                        </LinearGradient>
                      )}
                    </XStack>
                  </Stack>
                </Pressable>
              );
            })}
            <Pressable onPress={handleLogout}>
              <XStack px="$5" py="$3" gap="$4" alignItems="center">
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
    const colorScheme = Appearance.getColorScheme();
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
