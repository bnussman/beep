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
import { UserData, useUser } from "../utils/useUser";
import { Avatar } from "../components/Avatar";
import { MainNavParamList } from "./MainTabs";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../utils/Navigation";
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
  Stack,
  Text,
  XStack,
  Switch,
  Spinner,
  Button,
  Spacer,
} from "tamagui";
import { useAutoUpdate } from "../utils/updates";
import { Premium } from "../routes/Premium";
import { Pressable, useColorMode } from "native-base";
import { isMobile } from "../utils/constants";

const Logout = gql`
  mutation Logout {
    logout(isApp: true)
  }
`;

const Drawer = createDrawerNavigator<MainNavParamList>();

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
  const { navigate } = useNavigation<Navigation>();
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
      <Stack space={6} my={2} mx={2}>
        <Pressable onPress={() => navigate("Profile", { id: user?.id ?? "" })}>
          <XStack alignItems="center">
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
          </XStack>
        </Pressable>
        <Stack space={4}>
          <Stack space={3}>
            {!user?.isEmailVerified ? (
              <Button
                onPress={handleResendVerification}
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
                <XStack space={7} alignItems="center">
                  <Text fontWeight={500}>{name}</Text>
                  {name === "Premium" && <Stack borderRadius="xl" colorScheme="yellow"><Text>New</Text></Stack>}
                </XStack>
              </Pressable>
            ))}
            <Pressable onPress={handleLogout}>
              <XStack px={5} py={3} space={7} alignItems="center">
                {loading ? (
                  <Spinner size="sm" />
                ) : null}
                <Text mr={4} fontWeight={500}>
                  Logout
                </Text>
              </XStack>
            </Pressable>
            <XStack px={5} py={3} space={5} alignItems="center">
              <Text>☀️</Text>
              <Switch
                native={isMobile}
                checked={colorMode === "dark"}
                onCheckedChange={toggleColorMode}
              />
              <Text>️🌑</Text>
            </XStack>
          </Stack>
        </Stack>
      </Stack>
    </DrawerContentScrollView>
  );
}

export function BeepDrawer() {
  const { colorMode } = useColorMode();
  const { user } = useUser();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: "front",
        headerTintColor: colorMode === "dark" ? "white" : "black",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {!user?.isBeeping && (
        <Drawer.Screen name="Ride" component={MainFindBeepScreen} />
      )}
      <Drawer.Screen name="Beep" component={StartBeepingScreen} />
      <Drawer.Screen name="Cars" component={Cars} />
      <Drawer.Screen name="Premium" component={Premium} />
      <Drawer.Screen name="Profile" component={EditProfileScreen} />
      <Drawer.Screen name="Beeps" component={BeepsScreen} />
      <Drawer.Screen name="Ratings" component={RatingsScreen} />
      <Drawer.Screen name="Feedback" component={Feedback} />
    </Drawer.Navigator>
  );
}
