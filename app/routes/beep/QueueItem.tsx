import React from "react";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Linking, Pressable } from "react-native";
import { Navigation } from "../../utils/Navigation";
import { GetInitialQueueQuery } from "../../generated/graphql";
import { isMobile, Unpacked } from "../../utils/constants";
import { openDirections } from "../../utils/links";
import { CancelBeep } from "../../components/CancelButton";
import { ApolloError, useMutation } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Avatar } from "../../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
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

interface Props {
  item: Unpacked<GetInitialQueueQuery["getQueue"]>;
  index: number;
}

export function QueueItem({ item }: Props) {
  const [cancel] = useMutation(CancelBeep);
  const { navigate } = useNavigation<Navigation>();

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

  if (item.state > 0) {
    return (
      <Card mb={2}>
        <Box>
          <Pressable
            onPress={() =>
              navigate("Profile", {
                id: item.rider.id,
                beep: item.id,
              })
            }
          >
            <HStack space={2} alignItems="center">
              <Avatar size={50} url={item.rider.photoUrl} />
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
                      as={Entypo}
                      color="gray.400"
                      name="dots-three-horizontal"
                      size={19}
                      mr={4}
                    />
                  </Pressable>
                )}
              >
                <Menu.Item
                  onPress={() => Linking.openURL("tel:" + item.rider.phone)}
                >
                  <HStack alignItems="center">
                    <Text>Call</Text>
                    <Spacer />
                    <Icon as={MaterialCommunityIcons} name="phone" />
                  </HStack>
                </Menu.Item>
                <Menu.Item
                  onPress={() => Linking.openURL("sms:" + item.rider.phone)}
                >
                  <HStack alignItems="center">
                    <Text>Text</Text>
                    <Spacer />
                    <Icon as={MaterialCommunityIcons} name="message-text" />
                  </HStack>
                </Menu.Item>
                <Menu.Item
                  onPress={() =>
                    openDirections("Current+Location", item.origin)
                  }
                >
                  <HStack alignItems="center">
                    <Text>Directions to Rider</Text>
                    <Spacer />
                    <Icon as={MaterialCommunityIcons} name="map-legend" />
                  </HStack>
                </Menu.Item>
                <Divider my={1} w="100%" />
                <Menu.Item onPress={onCancelPress}>
                  <HStack alignItems="center">
                    <Text color="red.400">Cancel Beep</Text>
                    <Spacer />
                    <Icon
                      as={MaterialCommunityIcons}
                      name="cancel"
                      color="red.400"
                    />
                  </HStack>
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
          onPress={() =>
            navigate("Profile", {
              id: item.rider.id,
              beep: item.id,
            })
          }
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
            <Avatar mr={2} size={45} url={item.rider.photoUrl} />
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
