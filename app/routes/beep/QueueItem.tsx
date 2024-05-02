import React from "react";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Alert, Linking, Pressable } from "react-native";
import { isMobile, Unpacked } from "../../utils/constants";
import { getRawPhoneNumber, openDirections } from "../../utils/links";
import { CancelBeep } from "../../components/CancelButton";
import { ApolloError, useMutation } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Avatar } from "../../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Status } from "../../utils/types";
import { ResultOf } from "gql.tada";
import { GetInitialQueue } from "./StartBeeping";
import { Card, XStack, Text, Stack, Button } from "@beep/ui";
import { MoreVertical } from "@tamagui/lucide-icons";
import * as DropdownMenu from "zeego/dropdown-menu";

interface Props {
  item: Unpacked<ResultOf<typeof GetInitialQueue>["getQueue"]>;
  index: number;
}

export function QueueItem({ item }: Props) {
  const [cancel] = useMutation(CancelBeep);
  const { navigate } = useNavigation();

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
        { cancelable: true },
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
      <Card mb="$2" p="$3">
        <Stack>
          <XStack gap="$2" alignItems="center" justifyContent="space-between">
            <Pressable
              onPress={() =>
                navigate("User", {
                  id: item.rider.id,
                  beepId: item.id,
                })
              }
            >
              <XStack alignItems="center" gap="$2">
                <Avatar size="sm" src={item.rider.photo ?? undefined} />
                <Stack>
                  <Text fontWeight="bold">{item.rider.name}</Text>
                  {item.rider.rating && (
                    <Text fontSize="$1">{printStars(item.rider.rating)}</Text>
                  )}
                </Stack>
              </XStack>
            </Pressable>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  mr="$2"
                  hitSlop={20}
                  icon={<MoreVertical size="$1.5" />}
                  unstyled
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  key="Call"
                  onSelect={() =>
                    Linking.openURL(
                      "tel:" + getRawPhoneNumber(item.rider.phone),
                    )
                  }
                >
                  <DropdownMenu.ItemTitle>Call</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  key="Text"
                  onSelect={() =>
                    Linking.openURL(
                      "sms:" + getRawPhoneNumber(item.rider.phone),
                    )
                  }
                >
                  <DropdownMenu.ItemTitle>Text</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  key="directions-to-rider"
                  onSelect={() =>
                    openDirections("Current+Location", item.origin)
                  }
                >
                  <DropdownMenu.ItemTitle>
                    Directions to Rider
                  </DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  key="cancel"
                  onSelect={onCancelPress}
                  destructive
                >
                  <DropdownMenu.ItemTitle>Cancel Beep</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Arrow />
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </XStack>
          <Text>
            <Text fontWeight="bold" mr="$2">
              Group Size
            </Text>{" "}
            <Text>{item.groupSize}</Text>
          </Text>
          <Text>
            <Text fontWeight="bold" mr="$2">
              Pick Up
            </Text>{" "}
            <Text>{item.origin}</Text>
          </Text>
          <Text>
            <Text fontWeight="bold" mr="$2">
              Drop Off
            </Text>{" "}
            <Text>{item.destination}</Text>
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card my="$2" p="$3">
      <Stack gap="$1">
        <Pressable
          onPress={() =>
            navigate("User", {
              id: item.rider.id,
              beepId: item.id,
            })
          }
        >
          <XStack alignItems="center" justifyContent="space-between">
            <Stack>
              <Text fontWeight="bold" fontSize="$7">
                {item.rider.name}
              </Text>
              <Text fontSize="$1">
                {item.rider.rating && printStars(item.rider.rating)}
              </Text>
            </Stack>
            <Avatar
              className="mr-2"
              size="sm"
              src={item.rider.photo ?? undefined}
            />
          </XStack>
        </Pressable>
        <Text>
          <Text fontWeight="bold">Group Size</Text>{" "}
          <Text>{item.groupSize}</Text>
        </Text>
        <Text>
          <Text fontWeight="bold" mr="$2">
            Pick Up
          </Text>{" "}
          <Text>{item.origin}</Text>
        </Text>
        <Text>
          <Text fontWeight="bold" mr="$2">
            Drop Off
          </Text>{" "}
          <Text>{item.destination}</Text>
        </Text>
      </Stack>
      <XStack gap="$2" mt="$2">
        <AcceptDenyButton type="deny" item={item} />
        <AcceptDenyButton type="accept" item={item} />
      </XStack>
    </Card>
  );
}
