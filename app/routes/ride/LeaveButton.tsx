import React, { useState } from "react";
import { Alert } from "react-native";
import { isMobile } from "../../utils/constants";
import { Button } from "@/components/Button";
import { trpc } from "@/utils/trpc";

interface Props {
  beepersId: string;
}

export function LeaveButton(props: Props) {
  const { beepersId } = props;
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.rider.leaveQueue.useMutation({
    onSuccess() {
      utils.rider.currentRide.setData(undefined, null);
    },
    onError(error) {
      alert(error.message);
    }
  });

  function leaveQueueWrapper(): void {
    if (isMobile) {
      Alert.alert(
        "Leave Queue?",
        "Are you sure you want to leave this queue?",
        [
          {
            text: "No",
            style: "cancel",
          },
          { text: "Yes", onPress: () => mutate({ beeperId: beepersId }) },
        ],
        { cancelable: true },
      );
    } else {
      mutate({ beeperId: beepersId });
    }
  }

  return (
    <Button
      isLoading={isPending}
      onPress={() => leaveQueueWrapper()}
      activityIndicatorProps={{ color: "white" }}
    >
      Leave Queue
    </Button>
  );
}
