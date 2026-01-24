import React from "react";
import { isMobile } from "../utils/constants";
import { Button } from "@/components/Button";
import { Alert } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc, Outputs } from "@/utils/orpc";

interface Props {
  beep: Outputs['beeper']['queue'][number];
}

export function CancelButton({ beep }: Props) {
  const queryClient = useQueryClient();

  const { mutate: cancel, isPending } = useMutation(orpc.beeper.updateBeep.mutationOptions({
    onSuccess(data) {
      queryClient.setQueryData(orpc.beeper.watchQueue.experimental_liveKey(), data);
    },
    onError(error) {
      alert(error.message);
    }
  }));

  const onPress = () => {
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
    cancel({ beepId: beep.id, data: { status: "canceled" } });
  };

  return (
    <Button
      isLoading={isPending}
      onPress={onPress}
    >
      Cancel Beep
    </Button>
  );
}
