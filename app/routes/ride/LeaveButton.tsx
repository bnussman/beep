import React, { useState } from "react";
import { Alert as NativeAlert } from "react-native";
import { isMobile } from "../../utils/constants";
import { useMutation } from "@apollo/client";
import { Button, IButtonProps, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert } from "../../utils/Alert";
import { graphql } from "gql.tada";

const LeaveQueue = graphql(`
  mutation LeaveQueue($id: String!) {
    leaveQueue(id: $id)
  }
`);

interface Props extends IButtonProps {
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
      isLoading={isLoading}
      onPress={() => leaveQueueWrapper()}
      colorScheme="red"
      _text={{ color: "#fff" }}
      endIcon={
        <Icon
          as={MaterialCommunityIcons}
          name="exit-to-app"
          size={22}
          color="white"
        />
      }
      {...rest}
    >
      Leave Queue
    </Button>
  );
}
