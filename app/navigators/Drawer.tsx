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
  XStack,
  Switch,
  Spinner,
  Button,
  SizableText,
} from "tamagui";
import { useAutoUpdate } from "../utils/updates";
import { Premium } from "../routes/Premium";
import { Pressable, useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      <Stack>
        <Pressable onPress={() => navigate("Profile", { id: user?.id ?? "" })}>
          <XStack alignItems="center">
            <Avatar
              mr="$4"
              size="$4"
              url={user?.photo}
            />
            <Stack flexGrow={1} my="$4">
              <SizableText fontWeight="bold" fontSize="$4">
                {user?.name}
              </SizableText>
              <SizableText color="$gray5">
                @{user?.username}
              </SizableText>
            </Stack>
            <SizableText fontSize="$8" mr="$4">🎄</SizableText>
          </XStack>
        </Pressable>
        <Stack space={4}>
          <Stack space="$3">
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
                onPress={() => {
                  props.navigation.navigate(name);
                }}
              >
                <XStack space="$4" alignItems="center" backgroundColor={index === props.state.index ? "$gray3" : undefined} p="$2" mx="$2" borderRadius="$4" px="$3">
                  <MaterialCommunityIcons name={getIcon(name)} size={18} color="white" />
                  <SizableText>{name}</SizableText>
                  {name === "Premium" && <Stack bg="$yellow8" borderRadius="$2" px="$2" py="$1"><SizableText>New</SizableText></Stack>}
                </XStack>
              </Pressable>
            ))}
            <Pressable onPress={handleLogout}>
              <XStack space="$4" alignItems="center" mx="$2" borderRadius="$4" px="$3">
                <MaterialCommunityIcons name="logout-variant" size={18} color="white" />
                {loading ? (
                  <Spinner size="small" />
                ) : null}
                <SizableText mr={4}>
                  Logout
                </SizableText>
              </XStack>
            </Pressable>
          </Stack>
        </Stack>
      </Stack>
    </DrawerContentScrollView>
  );
}

export function BeepDrawer() {
  const colorMode = useColorScheme();
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
