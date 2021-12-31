import React, { useState } from "react";
import { Button } from "native-base";
import { gql, useMutation } from "@apollo/client";
import { UpdateBeeperQueueMutation } from "../generated/graphql";

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

    try {
      await update({
        variables: {
          queueId: queueId,
          riderId: riderId,
          value: value,
        },
      });
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }

  return (
    <Button
      colorScheme={isAccept ? "green" : "red"}
      _text={{ color: "white" }}
      isLoading={loading}
      onPress={() =>
        updateStatus(props.item.id, props.item.rider.id, props.type)
      }
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}

export default AcceptDenyButton;
