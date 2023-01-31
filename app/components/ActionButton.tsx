import React, { useState } from "react";
import { GetInitialQueueQuery } from "../generated/graphql";
import { Unpacked } from "../utils/constants";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Button } from "native-base";
import { Status } from "../utils/types";

type InProgressStatuses = Exclude<Status, Status.COMPLETE | Status.DENIED>;

const nextStatusMap: Record<InProgressStatuses, Status> = {
  [Status.WAITING]: Status.ACCEPTED,
  [Status.ACCEPTED]: Status.ON_THE_WAY,
  [Status.ON_THE_WAY]: Status.HERE,
  [Status.HERE]: Status.IN_PROGRESS,
  [Status.IN_PROGRESS]: Status.COMPLETE,
};

interface Props {
  beep: Unpacked<GetInitialQueueQuery["getQueue"]>;
}

export const UpdateBeeperQueue = gql`
  mutation UpdateBeeperQueue($id: String!, $status: String!) {
    setBeeperQueue(input: { id: $id, status: $status }) {
      id
      groupSize
      origin
      destination
      status
    }
  }
`;

function _Button(props: Props) {
  const { beep } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [update] = useMutation(UpdateBeeperQueue);

  const getMessage = () => {
    switch (beep.status) {
      case Status.WAITING:
        return "Accept";
      case Status.ACCEPTED:
        return "I'm on the way";
      case Status.ON_THE_WAY:
        return "I'm here";
      case Status.HERE:
        return "I'm now beeping this rider";
      case Status.IN_PROGRESS:
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
        status: nextStatusMap[beep.status as InProgressStatuses],
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
