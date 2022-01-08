import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Box,
  Pressable,
  VStack,
  Text,
  HStack,
  Divider,
  Icon,
  Avatar,
  Flex,
  Switch,
  useColorMode,
  Spinner,
} from "native-base";
import { MainFindBeepScreen } from "../routes/ride/FindBeep";
import { UserContext } from "../utils/UserContext";
import {
  LOCATION_TRACKING,
  StartBeepingScreen,
} from "../routes/beep/StartBeeping";
import { RatingsScreen } from "../routes/Ratings";
import { BeepsScreen } from "../routes/Beeps";
import { ChangePasswordScreen } from "../routes/settings/ChangePassword";
import { EditProfileScreen } from "../routes/settings/EditProfile";
import { gql, useMutation } from "@apollo/client";
import { LogoutMutation, ResendMutation } from "../generated/graphql";
import { client } from "../utils/Apollo";
import { UserData } from "../App";

const Logout = gql`
  mutation Logout {
    logout(isApp: true)
  }
`;

const Drawer = createDrawerNavigator();

const getIcon = (screenName: string) => {
  switch (screenName) {
    case "Ride":
      return "car";
    case "Beep":
      return "taxi";
    case "Edit Profile":
      return "account-edit";
    case "Change Password":
      return "form-textbox-password";
    case "Beeps":
      return "car-multiple";
    case "Ratings":
      return "account-star";
    default:
      return "car";
  }
};

const Resend = gql`
  mutation Resend {
    resendEmailVarification
  }
`;

function CustomDrawerContent(props: any) {
  const user = React.useContext(UserContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const [logout, { loading }] = useMutation<LogoutMutation>(Logout);
  const [resend, { loading: resendLoading }] =
    useMutation<ResendMutation>(Resend);

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

    props.navigation.reset(
      {
        index: 0,
        routes: [{ name: "Login" }],
        key: null,
      },
      () => {
        client.writeQuery({
          query: UserData,
          data: {
            getUser: null,
          },
        });
      }
    );
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
    <DrawerContentScrollView {...props} safeArea>
      <VStack space={6} my={2} mx={1}>
        <Flex ml={2} direction="row" alignItems="center">
          <Avatar
            key={user.photoUrl}
            mr={4}
            source={{ uri: !user?.photoUrl ? undefined : user.photoUrl }}
          >
            {user?.isBeeping ? <Avatar.Badge size={20} bg="green.400" /> : null}
          </Avatar>
          <Box>
            <Text bold>{user?.name}</Text>
            <Text fontSize={14} mt={1} fontWeight={500}>
              @{user?.username}
            </Text>
          </Box>
        </Flex>
        <VStack divider={<Divider />} space={4}>
          <VStack space={3}>
            {props.state.routeNames.map((name: string, index: number) => (
              <Pressable
                key={index}
                px={5}
                py={3}
                rounded="md"
                bg={
                  index === props.state.index
                    ? "rgba(6, 182, 212, 0.1)"
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
                    as={<MaterialCommunityIcons name={getIcon(name)} />}
                  />
                  <Text fontWeight={500}>{name}</Text>
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
                    as={<MaterialCommunityIcons name="logout-variant" />}
                  />
                )}
                <Text mr={4} fontWeight={500}>
                  Logout
                </Text>
              </HStack>
            </Pressable>
            {!user.isEmailVerified ? (
              <Pressable onPress={handleResendVerification}>
                <HStack px={5} py={3} space={7} alignItems="center">
                  {resendLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Icon
                      color="red.400"
                      size={6}
                      as={
                        <MaterialCommunityIcons name="alert-circle-outline" />
                      }
                    />
                  )}
                  <Text mr={4} fontWeight={500}>
                    Resend Verification Email
                  </Text>
                </HStack>
              </Pressable>
            ) : null}
            <Flex px={5} py={3} direction="row" alignItems="center">
              <Text mr={4}>Dark Mode</Text>
              <Switch
                isChecked={colorMode === "dark"}
                onToggle={toggleColorMode}
              />
            </Flex>
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}

export function BeepDrawer() {
  return (
    <Box flex={1}>
      <Drawer.Navigator
        screenOptions={{ drawerType: "front" }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Ride" component={MainFindBeepScreen} />
        <Drawer.Screen name="Beep" component={StartBeepingScreen} />
        <Drawer.Screen name="Edit Profile" component={EditProfileScreen} />
        <Drawer.Screen
          name="Change Password"
          component={ChangePasswordScreen}
        />
        <Drawer.Screen name="Beeps" component={BeepsScreen} />
        <Drawer.Screen name="Ratings" component={RatingsScreen} />
      </Drawer.Navigator>
    </Box>
  );
}
