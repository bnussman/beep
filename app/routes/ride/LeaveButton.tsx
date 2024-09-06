import React, { useState } from "react";
import { Alert } from "react-native";
import { isMobile } from "../../utils/constants";
import { Button } from "@/components/Button";
import { trpc } from "@/utils/trpc";

interface Props {
  beepersId: string;
}

export function LeaveButton(props: Props) {
  const { beepersId, ...rest } = props;
  const { mutateAsync: leave } = trpc.rider.leaveQueue.useMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          { text: "Yes", onPress: () => leaveQueue() },
        ],
        { cancelable: true },
      );
    } else {
      leaveQueue();
    }
  }

  async function leaveQueue(): Promise<void> {
    setIsLoading(true);
    leave({ beeperId: beepersId }).catch((error) => {
      alert(error.message);
      setIsLoading(false);
    });
  }

  return (
    <Button
      isLoading={isLoading}
      onPress={() => leaveQueueWrapper()}
      activityIndicatorProps={{ color: "white" }}
      className="min-w-48 !text-white !bg-red-400 active:!bg-red-500"
      {...rest}
    >
      Leave Queue
    </Button>
  );
}
