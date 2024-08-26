import React, { useState } from "react";
import { isMobile, Unpacked } from "../utils/constants";
import { Button } from "@/components/Button";
import { useEffect } from "react";
import { Alert } from "react-native";
import { RouterOutput, trpc } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

interface Props {
  beep: RouterOutput['beeper']['queue'][number];
}

export function CancelButton({ beep }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: cancel } = trpc.beeper.updateBeep.useMutation();

  useEffect(() => {
    setIsLoading(false);
  }, [beep]);

  const onPress = () => {
    if (isMobile) {
      Alert.alert(
        "Cancel Beep?",
        "Are you sure you want to cancel this beep?",
        [
          {
            text: "No",
            onPress: () => {
              setIsLoading(false);
            },
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
    setIsLoading(true);
    cancel({ beepId: beep.id, data: { status: "canceled" } }).catch((error: TRPCClientError<any>) => {
      setIsLoading(false);
      alert(error.message);
    });
  };

  return (
    <Button
      isLoading={isLoading}
      onPress={onPress}
      className="text-white bg-red-400 dark:bg-red-400 dark:active:bg-red-500 active:bg-red-500"
    >
      Cancel Beep
    </Button>
  );
}
