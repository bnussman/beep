import React, { useState } from "react";
import { Alert } from "react-native";
import { isMobile } from "../../utils/config";
import { gql, useMutation } from "@apollo/client";
import { LeaveQueueMutation } from "../../generated/graphql";
import { Button } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LeaveQueue = gql`
  mutation LeaveQueue($id: String!) {
    riderLeaveQueue(id: $id)
  }
`;

interface Props {
  beepersId: string;
}

function LeaveButton(props: Props): JSX.Element {
  const { beepersId } = props;
  const [leave] = useMutation<LeaveQueueMutation>(LeaveQueue, {
    variables: { id: beepersId },
  });
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
        { cancelable: true }
      );
    } else {
      leaveQueue();
    }
  }

  async function leaveQueue(): Promise<void> {
    setIsLoading(true);
    try {
      await leave();
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  }

  return (
    <Button
      isLoading={isLoading}
      onPress={() => leaveQueueWrapper()}
      colorScheme="red"
      _text={{ color: "#fff" }}
      endIcon={
        <MaterialCommunityIcons name="exit-to-app" size={22} color="white" />
      }
    >
      Leave Queue
    </Button>
  );
}

export default LeaveButton;
