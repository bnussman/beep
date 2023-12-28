import React, { useState } from "react";
import { GetInitialQueueQuery } from "../generated/graphql";
import { isMobile, Unpacked } from "../utils/constants";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button as _Button, Spinner } from "tamagui";
import { useEffect } from "react";
import { Alert } from "react-native";

interface Props {
  beep: Unpacked<GetInitialQueueQuery["getQueue"]>;
}

export const CancelBeep = gql`
  mutation CancelBeep($id: String!) {
    cancelBeep(id: $id)
  }
`;

function Button(props: Props) {
  const { beep } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [cancel] = useMutation(CancelBeep);

  useEffect(() => {
    setIsLoading(false);
  }, [beep]);

  const onPress = () => {
    if (isMobile) {
      Alert.alert(
        "Cancel Beep?",
        "Are you sure you want to cancel this beep?",
        [
          {
            text: "No",
            onPress: () => {
              setIsLoading(false);
            },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: onCancel,
          },
        ],
        { cancelable: true },
      );
    } else {
      onCancel();
    }
  };

  const onCancel = () => {
    setIsLoading(true);
    cancel({ variables: { id: beep.id } }).catch((error: ApolloError) => {
      setIsLoading(false);
      alert(error.message);
    });
  };

  return (
    <_Button
      iconAfter={isLoading ? <Spinner /> : undefined}
      onPress={onPress}
      theme="red"
    >
      Cancel Beep
    </_Button>
  );
}

export const CancelButton = React.memo(Button);
