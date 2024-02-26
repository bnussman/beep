import React from "react";
import { Container } from "../../components/Container";
import { useMutation } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import {
  Text,
  Button,
  Input,
  Stack,
  Label,
  Spinner,
} from "@beep/ui";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import { Alert, Linking } from "react-native";
import { Card } from "../../components/Card";
import { VariablesOf, graphql } from "gql.tada";

const CreateFeedback = graphql(`
  mutation CreateFeedback($message: String!) {
    createFeedback(message: $message) {
      id
    }
  }
`);

export function Feedback() {
  const [createFeedback, { loading, error }] = useMutation(CreateFeedback);

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

  const validationErrors = useValidationErrors<VariablesOf<typeof CreateFeedback>>(error);

  const onSubmit = handleSubmit((variables) => {
    createFeedback({ variables })
      .then(() => {
        Alert.alert(
          "Thank you for your feedback!",
          "We will contact you if we have any further questions"
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
    <Container p="$3" keyboard>
      <Stack gap="$2">
        <Card
          pressable
          onPress={() =>
            Linking.openURL(
              "https://apps.apple.com/us/app/ride-beep-app/id1528601773"
            )
          }
        >
          <Text>
            Please submit your ideas, bugs, and feature requests here! If you
            like the app, pleae consider clicking here to leave us an App Store
            rating.
          </Text>
        </Card>
        <Stack>
          <Label htmlFor="message" fontWeight="bold">Feedback</Label>
          <Controller
            name="message"
            rules={{ required: "Message is required" }}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="message"
                minHeight={170}
                multiline
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                size="lg"
              />
            )}
          />
          <Text color="$red10">
            {errors.message?.message}
            {validationErrors?.message?.[0]}
          </Text>
        </Stack>
        <Button
          onPress={onSubmit}
          iconAfter={loading ? <Spinner /> : undefined}
        >
          Submit
        </Button>
      </Stack>
    </Container>
  );
}
