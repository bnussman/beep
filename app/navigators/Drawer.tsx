import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import {
  Pressable,
  VStack,
  Text,
  HStack,
  Divider,
  Icon,
  Switch,
  useColorMode,
  Spinner,
  Button,
  Stack,
  Spacer,
  Badge,
} from "native-base";
import { useAutoUpdate } from "../utils/updates";
import { Premium } from "../routes/Premium";

const Logout = gql`
  mutation Logout {
    logout(isApp: true)
  }
`;

const getIcon = (screenName: string) => {
  switch (screenName) {
    case "Ride":
      return "car";
    case "Beep":
      return "steering";
    case "Profile":
      return "account-edit";
    case "Change Password":
      return "form-textbox-password";
    case "Beeps":
      return "car-multiple";
    case "Ratings":
      return "account-star";
    case "My Cars":
      return "car";
    case "Changelog":
      return "playlist-plus";
    case "Feedback":
      return "help-circle-outline";
    case "Premium":
      return "shield-star-outline";
    default:
      return "car";
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
  const { colorMode, toggleColorMode } = useColorMode();
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
          "Successfully resent verification email. Please check your email for further instructions."
        )
      )
      .catch((error) => alert(error.message));
  };

  return (
    <DrawerContentScrollView {...props}>
      <VStack space={6} my={2} mx={2}>
        <Pressable onPress={() => navigate("User", { id: user?.id ?? "" })}>
          <HStack alignItems="center">
            <Avatar
              mr={2}
              size="md"
              url={user?.photo}
              online={user?.isBeeping}
            />
            <Stack flexShrink={1}>
              <Text fontWeight="extrabold" letterSpacing="xs" fontSize="lg">
                {user?.name}
              </Text>
              <Text color="gray.500" lineHeight="xs" _dark={{ color: "gray.300" }}>
                @{user?.username}
              </Text>
            </Stack>
            <Spacer />
            <Text fontSize="3xl" px={2}>🎄</Text>
          </HStack>
        </Pressable>
        <VStack divider={<Divider />} space={4}>
          <VStack space={3}>
            {!user?.isEmailVerified ? (
              <Button
                colorScheme="red"
                isLoading={resendLoading}
                onPress={handleResendVerification}
                leftIcon={
                  <Icon
                    name="alert-circle-outline"
                    size={6}
                    as={MaterialCommunityIcons}
                  />
                }
              >
                Resend Verification Email
              </Button>
            ) : null}
            {props.state.routeNames.map((name: string, index: number) => (
              <Pressable
                key={index}
                px={5}
                py={3}
                rounded="md"
                bg={
                  index === props.state.index
                    ? "rgba(143, 143, 143, 0.1)"
                    : "transparent"
                }
                onPress={() => {
                  props.navigation.navigate(name);
                }}
              >
                <HStack space={7} alignItems="center">
                  <Icon
                    color={
                      index === props.state.index ? "primary.500" : "gray.500"
                    }
                    size={5}
                    as={MaterialCommunityIcons}
                    name={getIcon(name)}
                  />
                  <Text fontWeight={500}>{name}</Text>
                  {name === "Premium" && <Badge borderRadius="xl" colorScheme="yellow">New</Badge>}
                </HStack>
              </Pressable>
            ))}
            <Pressable onPress={handleLogout}>
              <HStack px={5} py={3} space={7} alignItems="center">
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <Icon
                    color="gray.500"
                    size={5}
                    as={MaterialCommunityIcons}
                    name="logout-variant"
                  />
                )}
                <Text mr={4} fontWeight={500}>
                  Logout
                </Text>
              </HStack>
            </Pressable>
            <HStack px={5} py={3} space={5} alignItems="center">
              <Text>☀️</Text>
              <Switch
                isChecked={colorMode === "dark"}
                onToggle={toggleColorMode}
              />
              <Text>️🌑</Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}

export const Drawer = createDrawerNavigator({
  screenOptions: () => {
    const { colorMode } = useColorMode();
    return {
      headerTintColor: colorMode === "dark" ? "white" : "black",
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
