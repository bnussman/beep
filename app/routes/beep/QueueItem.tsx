import React from "react";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Alert, Pressable } from "react-native";
import { GetInitialQueueQuery } from "../../generated/graphql";
import { isMobile, Unpacked } from "../../utils/constants";
import { CancelBeep } from "../../components/CancelButton";
import { ApolloError, useMutation } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Avatar } from "../../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
import { XStack, Stack, SizableText } from "tamagui";
import { Status } from "../../utils/types";

interface Props {
  item: Unpacked<GetInitialQueueQuery["getQueue"]>;
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
      <Card mb={2}>
        <Stack>
          <Pressable
            onPress={() =>
              navigate("User", {
                id: item.rider.id,
                beepId: item.id,
              })
            }
          >
            <XStack space={2} alignItems="center">
              <Avatar size={50} url={item.rider.photo} />
              <Stack>
                <SizableText fontWeight="bold">{item.rider.name}</SizableText>
                {item.rider.rating !== null &&
                item.rider.rating !== undefined ? (
                  <SizableText fontSize="$1">
                    {printStars(item.rider.rating)}
                  </SizableText>
                ) : null}
              </Stack>
              <Stack flexGrow={1} />
              {/*  <Menu
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
              </Menu> */}
            </XStack>
          </Pressable>
          <SizableText>
            <SizableText fontWeight="bold" mr={2}>
              Group Size
            </SizableText>{" "}
            <SizableText>{item.groupSize}</SizableText>
          </SizableText>
          <SizableText>
            <SizableText fontWeight="bold" mr={2}>
              Pick Up
            </SizableText>{" "}
            <SizableText>{item.origin}</SizableText>
          </SizableText>
          <SizableText>
            <SizableText fontWeight="bold" mr={2}>
              Drop Off
            </SizableText>{" "}
            <SizableText>{item.destination}</SizableText>
          </SizableText>
        </Stack>
      </Card>
    );
  }

  return (
    <Card mb={2}>
      <Stack space={1}>
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
              <SizableText fontWeight="bold">{item.rider.name}</SizableText>
              <SizableText fontSize="$1">
                {item.rider.rating !== null && item.rider.rating !== undefined
                  ? printStars(item.rider.rating)
                  : null}
              </SizableText>
            </Stack>
            <Stack flexGrow={1} />
            <Avatar mr={2} size={45} url={item.rider.photo} />
          </XStack>
        </Pressable>
        <SizableText>
          <SizableText fontWeight="bold">Group Size</SizableText>{" "}
          <SizableText>{item.groupSize}</SizableText>
        </SizableText>
        <SizableText>
          <SizableText fontWeight="bold" mr={2}>
            Pick Up
          </SizableText>{" "}
          <SizableText>{item.origin}</SizableText>
        </SizableText>
        <SizableText>
          <SizableText fontWeight="bold" mr={2}>
            Drop Off
          </SizableText>{" "}
          <SizableText>{item.destination}</SizableText>
        </SizableText>
      </Stack>
      <XStack space={2} mt={2}>
        <AcceptDenyButton type="deny" item={item} />
        <AcceptDenyButton type="accept" item={item} />
      </XStack>
    </Card>
  );
}
