import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import { LogoutMutation, ResendMutation } from "../generated/graphql";
import { client } from "../utils/Apollo";
import { UserData, useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import {
  LOCATION_TRACKING,
} from "../app/(app)/beep";
import {
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
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

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
    case "edit-profile":
      return "account-edit";
    case "change-password":
      return "form-textbox-password";
    case "beeps":
      return "car-multiple";
    case "ratings":
      return "account-star";
    case "cars":
      return "car";
    case "feedback":
      return "help-circle-outline";
    case "premium":
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

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useUser();
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
      <StatusBar style={colorMode === "dark" ? "light" : "dark"} />
      <VStack space={6} my={2} mx={2}>
        <Pressable onPress={() => router.push({ pathname: "/user/[id]/", params: { id: user?.id ?? "" } })}>
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