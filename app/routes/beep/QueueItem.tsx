import React from "react";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Alert, Linking, View } from "react-native";
import { isMobile, Unpacked } from "../../utils/constants";
import { getRawPhoneNumber, openDirections } from "../../utils/links";
import { CancelBeep } from "../../components/CancelButton";
import { ApolloError, useMutation } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Avatar } from "../../components/Avatar";
import { Button } from "@/components/Button";
import { useNavigation } from "@react-navigation/native";
import { Status } from "../../utils/types";
import { ResultOf } from "gql.tada";
import { GetInitialQueue } from "./StartBeeping";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Card variant="outlined" className="p-4" pressable>
            <View className="flex flex-row justify-between items-start">
              <View>
                <Text weight="black" size="2xl">
                  {item.rider.name}
                </Text>
                <Text size="sm">
                  {item.rider.rating && printStars(item.rider.rating)}
                </Text>
              </View>
              <Avatar
                className="mr-2"
                size="sm"
                src={item.rider.photo ?? undefined}
              />
            </View>
            <Text>
              <Text weight="bold">Group Size</Text> <Text>{item.groupSize}</Text>
            </Text>
            <Text>
              <Text weight="bold">Pick Up</Text> <Text>{item.origin}</Text>
            </Text>
            <Text>
              <Text weight="bold">Drop Off</Text> <Text>{item.destination}</Text>
            </Text>
          </Card>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            key="Call"
            onSelect={() =>
              Linking.openURL("tel:" + getRawPhoneNumber(item.rider.phone))
            }
          >
            <DropdownMenu.ItemTitle>Call</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            key="Text"
            onSelect={() =>
              Linking.openURL("sms:" + getRawPhoneNumber(item.rider.phone))
            }
          >
            <DropdownMenu.ItemTitle>Text</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            key="directions-to-rider"
            onSelect={() => openDirections("Current+Location", item.origin)}
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
    );
  }

  return (
    <Card variant="outlined" className="p-4">
      <View className="flex flex-row justify-between items-center">
        <View>
          <Text weight="black" size="2xl">
            {item.rider.name}
          </Text>
          <Text size="sm">
            {item.rider.rating && printStars(item.rider.rating)}
          </Text>
        </View>
        <Avatar
          className="mr-2"
          size="sm"
          src={item.rider.photo ?? undefined}
        />
      </View>
      <Text>
        <Text weight="bold">Group Size</Text> <Text>{item.groupSize}</Text>
      </Text>
      <Text>
        <Text weight="bold">Pick Up</Text> <Text>{item.origin}</Text>
      </Text>
      <Text>
        <Text weight="bold">Drop Off</Text> <Text>{item.destination}</Text>
      </Text>
      <View className="flex flex-row gap-2 mt-4">
        <AcceptDenyButton type="deny" item={item} />
        <AcceptDenyButton type="accept" item={item} />
      </View>
    </Card>
  );
}
