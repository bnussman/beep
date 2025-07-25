import React from "react";
import { isMobile } from "../utils/constants";
import { Button } from "@/components/Button";
import { Alert } from "react-native";
import { RouterOutput, trpc } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

interface Props {
  beep: RouterOutput['beeper']['queue'][number];
}

export function CancelButton({ beep }: Props) {
  const utils = trpc.useUtils();
  const { mutate: cancel, isPending } = trpc.beeper.updateBeep.useMutation({
    onSuccess(data) {
      utils.beeper.queue.setData(undefined, data);
    },
    onError(error) {
      alert(error.message);
    }
  });

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
