import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainFindBeepScreen } from "../routes/ride/FindBeep";
import { Feedback } from "../routes/feedback/Feedback";
import { RatingsScreen } from "../routes/Ratings";
import { BeepsScreen } from "../routes/Beeps";
import { EditProfileScreen } from "../routes/settings/EditProfile";
import { gql, useMutation } from "@apollo/client";
import { LogoutMutation, ResendMutation } from "../generated/graphql";
import { client } from "../utils/Apollo";
import { UserData, useIsUserNotBeeping, useUser } from "../utils/useUser";
import { Avatar } from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Cars } from "../routes/cars/Cars";
import {
  LOCATION_TRACKING,
  StartBeepingScreen,
} from "../routes/beep/StartBeeping";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Stack, XStack, Spinner, Button, SizableText } from "tamagui";
import { useAutoUpdate } from "../utils/updates";
import { Premium } from "../routes/Premium";
import { Pressable, useColorScheme } from "react-native";
import {
  BadgeCheck,
  Car,
  LogOut as LogOutIcon,
  CarTaxiFront,
  MessageSquare,
  Star,
  User,
} from "@tamagui/lucide-icons";

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
      return MessageSquare;
    case "Premium":
      return BadgeCheck;
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
  const [logout, { loading }] = useMutation<LogoutMutation>(Logout);
  const [resend, { loading: resendLoading }] =
    useMutation<ResendMutation>(Resend);

  useAutoUpdate();

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

    client.writeQuery({
      query: UserData,
      data: {
        getUser: null,
      },
    });
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
      <Stack>
        <Pressable onPress={() => navigate("User", { id: user?.id ?? "" })}>
          <XStack alignItems="center" px="$3" space="$3">
            <Avatar size="$4" url={user?.photo} />
            <Stack flexGrow={1} my="$4">
              <SizableText fontWeight="bold" fontSize="$4">
                {user?.name}
              </SizableText>
              <SizableText color="$gray10">@{user?.username}</SizableText>
            </Stack>
            <SizableText fontSize="$8"></SizableText>
          </XStack>
        </Pressable>
        <Stack space={4}>
          <Stack space="$3">
            {!user?.isEmailVerified && (
              <Button onPress={handleResendVerification}>
                Resend Verification Email
              </Button>
            )}
            {props.state.routeNames.map((name: string, index: number) => {
              const Icon = getIcon(name);
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    props.navigation.navigate(name);
                  }}
                >
                  <XStack
                    space="$4"
                    alignItems="center"
                    backgroundColor={
                      index === props.state.index ? "$gray3" : undefined
                    }
                    py={8}
                    mx="$3"
                    borderRadius="$4"
                    px="$3"
                  >
                    <Icon size={18} />
                    <SizableText>{name}</SizableText>
                    {name === "Premium" && (
                      <Stack bg="$yellow9" borderRadius="$2" px="$2" py="$1">
                        <SizableText size="$1" color="white">
                          New
                        </SizableText>
                      </Stack>
                    )}
                  </XStack>
                </Pressable>
              );
            })}
            <Pressable onPress={handleLogout}>
              <XStack
                space="$4"
                alignItems="center"
                mx="$2"
                borderRadius="$4"
                px="$4"
                py={8}
              >
                <LogOutIcon size={18} />
                {loading ? <Spinner size="small" /> : null}
                <SizableText mr={4}>Logout</SizableText>
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
    // const colorScheme = useColorScheme();
    return {
      // headerTintColor: colorScheme === "dark" ? "white" : "black",
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
