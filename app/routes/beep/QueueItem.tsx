import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { AcceptDenyButton } from "@/components/AcceptDenyButton";
import { Alert, Linking, View } from "react-native";
import { isMobile } from "@/utils/constants";
import { getRawPhoneNumber, openDirections } from "@/utils/links";
import { printStars } from "@/components/Stars";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { RouterOutput, trpc } from "@/utils/trpc";

interface Props {
  item: RouterOutput['beeper']['queue'][number];
  index: number;
}

export function QueueItem({ item }: Props) {
  const utils = trpc.useUtils();

  const { mutate } = trpc.beeper.updateBeep.useMutation({
    onSuccess(data) {
      utils.beeper.queue.setData(undefined, data);
    },
    onError(error) {
      alert(error.message);
    }
  });

  const onPromptCancel = () => {
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
    mutate({ beepId: item.id, data: { status: 'canceled' } });
  };

  if (item.status !== "waiting") {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Card variant="outlined" style={{ padding: 16 }} pressable>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text weight="800" size="2xl">
                  {item.rider.first} {item.rider.last}
                </Text>
                <Text size="sm">
                  {item.rider.rating && printStars(Number(item.rider.rating))}
                </Text>
              </View>
              <Avatar
                style={{ marginRight: 8 }}
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
            onSelect={onPromptCancel}
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
    <Card variant="outlined">
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View>
          <Text weight="800" size="2xl">
            {item.rider.first} {item.rider.last}
          </Text>
          <Text size="sm">
            {item.rider.rating && printStars(Number(item.rider.rating))}
          </Text>
        </View>
        <Avatar
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
      <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
        <AcceptDenyButton type="deny" item={item} />
        <AcceptDenyButton type="accept" item={item} />
      </View>
    </Card>
  );
}
