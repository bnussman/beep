import React, { useState } from "react";
import { Alert as NativeAlert } from "react-native";
import { isMobile } from "../../utils/constants";
import { useMutation } from "@apollo/client";
import { Button, ButtonProps, Spinner } from "@beep/ui";
import { Alert } from "../../utils/alert";
import { graphql } from "gql.tada";

const LeaveQueue = graphql(`
  mutation LeaveQueue($id: String!) {
    leaveQueue(id: $id)
  }
`);

interface Props extends ButtonProps {
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
        { cancelable: true }
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
      iconAfter={isLoading ? <Spinner /> : undefined}
      onPress={() => leaveQueueWrapper()}
      theme="red"
      {...rest}
    >
      Leave Queue
    </Button>
  );
}
