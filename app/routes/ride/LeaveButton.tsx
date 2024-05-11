import React, { useState } from "react";
import { Alert as NativeAlert } from "react-native";
import { isMobile } from "../../utils/constants";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/Button";
import { Alert } from "../../utils/alert";
import { graphql } from "gql.tada";

const LeaveQueue = graphql(`
  mutation LeaveQueue($id: String!) {
    leaveQueue(id: $id)
  }
`);

interface Props {
  beepersId: string;
}

export function LeaveButton(props: Props) {
  const { beepersId, ...rest } = props;
  const [leave] = useMutation(LeaveQueue, {
    variables: { id: beepersId },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function leaveQueueWrapper(): void {
    if (isMobile) {
      NativeAlert.alert(
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
    leave().catch((error) => {
      Alert(error);
      setIsLoading(false);
    });
  }

  return (
    <Button
      isLoading={isLoading}
      onPress={() => leaveQueueWrapper()}
      activityIndicatorProps={{ color: "white" }}
      className="min-w-48 !bg-red-400 active:!bg-red-500"
      {...rest}
    >
      Leave Queue
    </Button>
  );
}
