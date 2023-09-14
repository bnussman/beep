import React from "react";
import { AcceptDenyButton } from "../components/AcceptDenyButton";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Linking, Pressable } from "react-native";
import { GetInitialQueueQuery } from "../generated/graphql";
import { isMobile, Unpacked } from "../utils/constants";
import { getRawPhoneNumber, openDirections } from "../utils/links";
import { CancelBeep } from "./CancelButton";
import { ApolloError, useMutation } from "@apollo/client";
import { printStars } from "./Stars";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { Card } from "./Card";
import {
  Box,
  HStack,
  Text,
  Spacer,
  Stack,
  Icon,
  Menu,
  Divider,
} from "native-base";
import { Status } from "../utils/types";
import { router } from "expo-router";

interface Props {
  item: Unpacked<GetInitialQueueQuery["getQueue"]>;
  index: number;
}

export function QueueItem({ item }: Props) {
  const [cancel] = useMutation(CancelBeep);

  const onCancelPress = () => {
    if (isMobile) {
      Alert.alert(
        "Cancel Beep?",
        "Are you sure you want to cancel this beep?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: onCancel,
          },
        ],
        { cancelable: true }
      );
    } else {
      onCancel();
    }
  };

  const onCancel = () => {
    cancel({ variables: { id: item.id } }).catch((error: ApolloError) => {
      alert(error.message);
    });
  };

  if (item.status !== Status.WAITING) {
    return (
      <Card mb={2}>
        <Box>
          <Pressable
            onPress={() => router.push({ pathname: "/user/[id]/", params: { id: item.rider.id, beep: item.id } })}
          >
            <HStack space={2} alignItems="center">
              <Avatar size={50} url={item.rider.photo} />
              <Stack>
                <Text fontWeight="extrabold" letterSpacing="xs" fontSize="xl">
                  {item.rider.name}
                </Text>
                {item.rider.rating !== null &&
                item.rider.rating !== undefined ? (
                  <Text fontSize="xs">{printStars(item.rider.rating)}</Text>
                ) : null}
              </Stack>
              <Spacer />
              <Menu
                key={`menu-${item.id}`}
                w="190"
                trigger={(triggerProps) => (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}
                  >
                    <Icon
                      as={Ionicons}
                      name="ios-ellipsis-horizontal-circle"
                      color="gray.400"
                      size="xl"
                      mr={4}
                    />
                  </Pressable>
                )}
              >
                <Menu.Item
                  onPress={() =>
                    Linking.openURL(
                      "tel:" + getRawPhoneNumber(item.rider.phone)
                    )
                  }
                >
                  Call
                </Menu.Item>
                <Menu.Item
                  onPress={() =>
                    Linking.openURL(
                      "sms:" + getRawPhoneNumber(item.rider.phone)
                    )
                  }
                >
                  Text
                </Menu.Item>
                <Menu.Item
                  onPress={() =>
                    openDirections("Current+Location", item.origin)
                  }
                >
                  Directions to Rider
                </Menu.Item>
                <Divider my={1} w="100%" />
                <Menu.Item onPress={onCancelPress} _text={{ color: "red.400" }}>
                  Cancel Beep
                </Menu.Item>
              </Menu>
            </HStack>
          </Pressable>
          <Text>
            <Text bold mr={2}>
              Group Size
            </Text>{" "}
            <Text>{item.groupSize}</Text>
          </Text>
          <Text>
            <Text bold mr={2}>
              Pick Up
            </Text>{" "}
            <Text>{item.origin}</Text>
          </Text>
          <Text>
            <Text bold mr={2}>
              Drop Off
            </Text>{" "}
            <Text>{item.destination}</Text>
          </Text>
        </Box>
      </Card>
    );
  }

  return (
    <Card mb={2}>
      <Stack space={1}>
        <Pressable
          onPress={() => router.push({ pathname: "/user/[id]/", params: { id: item.rider.id, beep: item.id } })}
        >
          <HStack alignItems="center">
            <Stack>
              <Text fontWeight="extrabold" fontSize="xl">
                {item.rider.name}
              </Text>
              <Text fontSize="xs">
                {item.rider.rating !== null && item.rider.rating !== undefined
                  ? printStars(item.rider.rating)
                  : null}
              </Text>
            </Stack>
            <Spacer />
            <Avatar mr={2} size={45} url={item.rider.photo} />
          </HStack>
        </Pressable>
        <Text>
          <Text bold>Group Size</Text> <Text>{item.groupSize}</Text>
        </Text>
        <Text>
          <Text bold mr={2}>
            Pick Up
          </Text>{" "}
          <Text>{item.origin}</Text>
        </Text>
        <Text>
          <Text bold mr={2}>
            Drop Off
          </Text>{" "}
          <Text>{item.destination}</Text>
        </Text>
      </Stack>
      <HStack space={2} mt={2}>
        <AcceptDenyButton type="deny" item={item} />
        <AcceptDenyButton type="accept" item={item} />
      </HStack>
    </Card>
  );
}
