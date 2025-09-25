import React, { useState } from "react";
import { Alert } from "react-native";
import { isMobile } from "../../utils/constants";
import { Button } from "@/components/Button";
import { useTRPC } from "@/utils/trpc";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  beepersId: string;
}

export function LeaveButton(props: Props) {
  const trpc = useTRPC();
  const { beepersId } = props;
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation(
    trpc.rider.leaveQueue.mutationOptions({
      onSuccess() {
        queryClient.setQueryData(trpc.rider.currentRide.queryKey(), null);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

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
          {
            text: "Yes",
            onPress: () => mutate({ beeperId: beepersId }),
            style: "destructive",
          },
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
