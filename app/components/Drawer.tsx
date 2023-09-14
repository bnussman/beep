import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import { LogoutMutation, ResendMutation } from "../generated/graphql";
import { client } from "../utils/Apollo";
import { UserData, useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../utils/Navigation";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  Box,
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
} from "native-base";
import { LOCATION_TRACKING } from "../app/(app)/beep";

const Logout = gql`
  mutation Logout {
    logout(isApp: true)
  }
`;

const getIcon = (screenName: string) => {
  switch (screenName) {
    case "ride":
      return "car";
    case "beep":
      return "steering";
    case "profile":
      return "account-edit";
    case "beeps":
      return "car-multiple";
    case "ratings":
      return "account-star";
    case "cars":
      return "car";
    case "feedback":
      return "help-circle-outline";
    default:
      return "car";
  }
};

const Resend = gql`
  mutation Resend {
    resendEmailVarification
  }
`;

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useUser();
  const { navigate } = useNavigation<Navigation>();
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
        <Pressable onPress={() => navigate("Profile", { id: user?.id })}>
          <HStack alignItems="center">
            <Avatar
              mr={2}
              size="md"
              url={user?.photo}
              online={user?.isBeeping}
            />
            <Stack>
              <Text fontWeight="extrabold" letterSpacing="sm" fontSize="md">
                {user?.name}
              </Text>
              <Text color="gray.500" _dark={{ color: "gray.300" }}>
                @{user?.username}
              </Text>
            </Stack>
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
