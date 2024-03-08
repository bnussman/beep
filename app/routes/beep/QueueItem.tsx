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
import {
  Card,
  XStack,
  Text,
  Spacer,
  Stack,
  Menu,
  Button,
} from "@beep/ui";

interface Props {
  item: Unpacked<ResultOf<typeof GetInitialQueue>['getQueue']>;
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
      <Card mb="$2">
        <Stack>
          <Pressable
            onPress={() =>
              navigate("User", {
                id: item.rider.id,
                beepId: item.id,
              })
            }
          >
            <XStack gap="$2" alignItems="center">
              <Avatar size="$6" url={item.rider.photo} />
              <Stack>
                <Text fontWeight="bold">
                  {item.rider.name}
                </Text>
                {item.rider.rating && (
                  <Text fontSize="$1">{printStars(item.rider.rating)}</Text>
                )}
              </Stack>
              <Spacer />
              <Menu
                Trigger={<Button>Menu</Button>}
                items={[
                  { title: "Call", onPress: () => Linking.openURL("tel:" + getRawPhoneNumber(item.rider.phone)) },
                  { title: "Text", onPress: () => Linking.openURL("sms:" + getRawPhoneNumber(item.rider.phone)) },
                  {
                    title: "Directions to Rider",
                    onPress: () => openDirections("Current+Location", item.origin)
                  },
                  { title: "Cancel Beep", onPress: onCancelPress },
                ]}
              />
            </XStack>
          </Pressable>
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
    <Card mb="$2">
      <Stack gap="$1">
        <Pressable
          onPress={() =>
            navigate("User", {
              id: item.rider.id,
              beepId: item.id,
            })
          }
        >
          <XStack alignItems="center">
            <Stack>
              <Text fontWeight="bold">
                {item.rider.name}
              </Text>
              <Text fontSize="$1">
                {item.rider.rating && printStars(item.rider.rating)}
              </Text>
            </Stack>
            <Spacer />
            <Avatar mr={2} size={45} url={item.rider.photo} />
          </XStack>
        </Pressable>
        <Text>
          <Text fontWeight="bold">Group Size</Text> <Text>{item.groupSize}</Text>
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
