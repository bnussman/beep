import React, { useState } from "react";
import { Button } from "native-base";
import { gql, useMutation } from "@apollo/client";
import { UpdateBeeperQueueMutation } from "../generated/graphql";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert } from "../utils/Alert";

interface Props {
  type: string;
  item: any;
}

const UpdateBeeperQueue = gql`
  mutation UpdateBeeperQueue(
    $queueId: String!
    $riderId: String!
    $value: String!
  ) {
    setBeeperQueue(
      input: { queueId: $queueId, riderId: $riderId, value: $value }
    )
  }
`;

function AcceptDenyButton(props: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [update] = useMutation<UpdateBeeperQueueMutation>(UpdateBeeperQueue);

  const isAccept = props.type === "accept";

  async function updateStatus(
    queueId: string,
    riderId: string,
    value: string | boolean
  ): Promise<void> {
    setLoading(true);

    update({
      variables: {
        queueId: queueId,
        riderId: riderId,
        value: value,
      },
    }).catch((error) => {
      Alert(error);
      setLoading(false);
    });
  }

  return (
    <Button
      flex={isAccept ? 1 : undefined}
      colorScheme={isAccept ? "green" : "red"}
      _text={{ color: "white" }}
      isLoading={loading}
      onPress={() =>
        updateStatus(props.item.id, props.item.rider.id, props.type)
      }
      endIcon={
        <MaterialCommunityIcons
          name={isAccept ? "check" : "close"}
          size={22}
          color="white"
        />
      }
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}

export default AcceptDenyButton;
