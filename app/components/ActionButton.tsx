import React, { useState } from "react";
import { GetInitialQueueQuery } from "../generated/graphql";
import { Unpacked } from "../utils/constants";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button as _Button } from "native-base";
import { useEffect } from "react";
import { GradietnButton } from "./GradientButton";

interface Props {
  item: Unpacked<GetInitialQueueQuery["getQueue"]>;
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

function Button(props: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [update] = useMutation(UpdateBeeperQueue);

  const getMessage = () => {
    switch (props.item.state) {
      case 0:
        return "I'm on the way";
      case 1:
        return "I'm here";
      case 2:
        return "I'm now beeping this rider";
      case 3:
        return "Done beeping this rider";
      default:
        return "Yikes";
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [props.item]);

  const getColor = () => {
    switch (props.item.state) {
      case 3:
        return "green";
      default:
        return "blue";
    }
  };

  const onPress = () => {
    setIsLoading(true);
    update({
      variables: {
        queueId: props.item.id,
        riderId: props.item.rider.id,
        value: props.item.state < 3 ? "next" : "complete",
      },
    }).catch((error: ApolloError) => {
      setIsLoading(false);
      alert(error.message);
    });
  };

  return (
    <GradietnButton size="lg" isLoading={isLoading} onPress={onPress}>
      {getMessage()}
    </GradietnButton>
  );
}

export const ActionButton = React.memo(Button);
