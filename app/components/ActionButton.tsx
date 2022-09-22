import React, { useState } from "react";
import { GetInitialQueueQuery } from "../generated/graphql";
import { Unpacked } from "../utils/constants";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Button } from "native-base";

interface Props {
  beep: Unpacked<GetInitialQueueQuery["getQueue"]>;
}

const UpdateBeeperQueue = gql`
  mutation UpdateBeeperQueue($id: String!, $state: Float!) {
    setBeeperQueue(input: { id: $id, state: $state }) {
      id
      groupSize
      origin
      destination
      state
    }
  }
`;

function _Button(props: Props) {
  const { beep } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [update] = useMutation(UpdateBeeperQueue);

  const getMessage = () => {
    switch (beep.state) {
      case 0:
        return "Accept";
      case 1:
        return "I'm on the way";
      case 2:
        return "I'm here";
      case 3:
        return "I'm now beeping this rider";
      case 4:
        return "Done beeping this rider";
      default:
        return "Yikes";
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [beep]);

  const onPress = () => {
    setIsLoading(true);
    update({
      variables: {
        id: beep.id,
        state: beep.state + 1,
      },
    }).catch((error: ApolloError) => {
      setIsLoading(false);
      alert(error.message);
    });
  };

  return (
    <Button
      size="lg"
      isLoading={isLoading}
      onPress={onPress}
      _text={{ fontWeight: "extrabold" }}
    >
      {getMessage()}
    </Button>
  );
}

export const ActionButton = React.memo(_Button);
