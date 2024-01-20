import React, { useState } from "react";
import { isMobile, Unpacked } from "../utils/constants";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button as _Button } from "native-base";
import { useEffect } from "react";
import { Alert } from "react-native";
import { ResultOf } from "gql.tada";
import { GetInitialQueue } from "../routes/beep/StartBeeping";

interface Props {
  beep: Unpacked<ResultOf<typeof GetInitialQueue>['getQueue']>;
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
        { cancelable: true }
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
      isLoading={isLoading}
      colorScheme="red"
      onPress={onPress}
      backgroundColor="red.400"
      _pressed={{ backgroundColor: "red.500" }}
    >
      Cancel Beep
    </_Button>
  );
}

export const CancelButton = React.memo(Button);
