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
import { RouterOutput, useTRPC } from "@/utils/trpc";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  item: RouterOutput["beeper"]["queue"][number];
  index: number;
}

export function QueueItem({ item: beep }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    trpc.beeper.updateBeep.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(trpc.beeper.queue.queryKey(), data);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

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
    mutate({ beepId: beep.id, data: { status: "canceled" } });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Card variant="filled" style={{ padding: 16 }} pressable>
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text weight="800" size="2xl">
                {beep.rider.first} {beep.rider.last}
              </Text>
              {beep.rider.rating && (
                <Text size="xs">{printStars(Number(beep.rider.rating))}</Text>
              )}
            </View>
            <Avatar size="sm" src={beep.rider.photo ?? undefined} />
          </View>
          <Text>
            <Text weight="bold">Group Size</Text> <Text>{beep.groupSize}</Text>
          </Text>
          <Text>
            <Text weight="bold">Pick Up</Text> <Text>{beep.origin}</Text>
          </Text>
          <Text>
            <Text weight="bold">Drop Off</Text> <Text>{beep.destination}</Text>
          </Text>
        </Card>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {beep.status === "waiting" ? (
          <>
            <DropdownMenu.Item
              key="accept"
              onSelect={() =>
                mutate({ beepId: beep.id, data: { status: "accepted" } })
              }
            >
              <DropdownMenu.ItemTitle>Accept Beep</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              key="deny"
              onSelect={() =>
                mutate({ beepId: beep.id, data: { status: "denied" } })
              }
              destructive
            >
              <DropdownMenu.ItemTitle>Deny Beep</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </>
        ) : (
          <>
            <DropdownMenu.Item
              key="Call"
              onSelect={() =>
                Linking.openURL("tel:" + getRawPhoneNumber(beep.rider.phone))
              }
            >
              <DropdownMenu.ItemTitle>Call</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              key="Text"
              onSelect={() =>
                Linking.openURL("sms:" + getRawPhoneNumber(beep.rider.phone))
              }
            >
              <DropdownMenu.ItemTitle>Text</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              key="directions-to-rider"
              onSelect={() => openDirections("Current+Location", beep.origin)}
            >
              <DropdownMenu.ItemTitle>
                Directions to Rider
              </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              key="cancel"
              onSelect={onPromptCancel}
              destructive
            >
              <DropdownMenu.ItemTitle>Cancel Beep</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
