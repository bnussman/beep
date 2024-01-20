import React, { useState } from "react";
import { Unpacked } from "../utils/constants";
import { ApolloError, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Button } from "native-base";
import { Status } from "../utils/types";
import { ResultOf, graphql } from "gql.tada";
import { GetInitialQueue } from "../routes/beep/StartBeeping";

type InProgressStatuses = Exclude<
  Status,
  Status.COMPLETE | Status.DENIED | Status.CANCELED
>;

const nextStatusMap: Record<InProgressStatuses, Status> = {
  [Status.WAITING]: Status.ACCEPTED,
  [Status.ACCEPTED]: Status.ON_THE_WAY,
  [Status.ON_THE_WAY]: Status.HERE,
  [Status.HERE]: Status.IN_PROGRESS,
  [Status.IN_PROGRESS]: Status.COMPLETE,
};

interface Props {
  beep: Unpacked<ResultOf<typeof GetInitialQueue>['getQueue']>;
}

export const UpdateBeeperQueue = graphql(`
  mutation UpdateBeeperQueue($id: String!, $status: String!) {
    setBeeperQueue(input: { id: $id, status: $status }) {
      id
      groupSize
      origin
      destination
      status
      rider {
        id
        name
        first
        last
        venmo
        cashapp
        phone
        photo
        isStudent
        rating
      }
    }
  }
`);

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
