import React from "react";
import { Container } from "../../components/Container";
import { gql, useMutation } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Stack, Spinner, Label, SizableText } from "tamagui";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  CreateFeedbackMutation,
  CreateFeedbackMutationVariables,
} from "../../generated/graphql";
import { Alert, Linking } from "react-native";
import { Card } from "../../components/Card";

const CreateFeedback = gql`
  mutation CreateFeedback($message: String!) {
    createFeedback(message: $message) {
      id
    }
  }
`;

export function Feedback() {
  const [createFeedback, { loading, error }] =
    useMutation<CreateFeedbackMutation>(CreateFeedback);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: "",
    },
  });

  const validationErrors =
    useValidationErrors<CreateFeedbackMutationVariables>(error);

  const onSubmit = handleSubmit((variables) => {
    createFeedback({ variables })
      .then(() => {
        Alert.alert(
          "Thank you for your feedback!",
          "We will contact you if we have any further questions",
        );
        reset();
      })
      .catch((error) => {
        if (!isValidationError(error)) {
          alert(error);
        }
      });
  });

  return (
    <Container p="$4" keyboard>
      <Stack space="$2">
        <Card
          pressable
          onPress={() =>
            Linking.openURL(
              "https://apps.apple.com/us/app/ride-beep-app/id1528601773",
            )
          }
        >
          <SizableText>
            Please submit your ideas, bugs, and feature requests here! If you
            like the app, pleae consider clicking here to leave us an App Store
            rating.
          </SizableText>
        </Card>
        <Label>Feedback</Label>
        <Controller
          name="message"
          rules={{ required: "Message is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              minHeight={170}
              multiline
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              ref={ref}
            />
          )}
        />
        <SizableText color="$red10">
          {errors.message?.message}
          {validationErrors?.message?.[0]}
        </SizableText>
        <Button
          onPress={onSubmit}
          iconAfter={loading ? <Spinner /> : undefined}
          textProps={{ fontWeight: "bold" }}
        >
          Submit
        </Button>
      </Stack>
    </Container>
  );
}
