import React from "react";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { useMutation } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { Alert, Linking } from "react-native";
import { VariablesOf, graphql } from "gql.tada";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

  const validationErrors =
    useValidationErrors<VariablesOf<typeof CreateFeedback>>(error);

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
    <KeyboardAwareScrollView
      contentContainerClassName="p-4"
      scrollEnabled={false}
    >
      <Card
        variant="outlined"
        className="p-4 mb-4"
        onPress={() =>
          Linking.openURL(
            "https://apps.apple.com/us/app/ride-beep-app/id1528601773",
          )
        }
      >
        <Text>
          Please submit your ideas, bugs, and feature requests here! If you like
          the app, pleae consider clicking here to leave us an App Store rating.
        </Text>
      </Card>
      <Label htmlFor="feedback-input">Feedback</Label>
      <Controller
        name="message"
        rules={{ required: "Message is required" }}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            id="feeback-input"
            multiline
            numberOfLines={4}
            style={{ minHeight: 150 }}
            onBlur={onBlur}
            onChangeText={(val) => onChange(val)}
            value={value}
          />
        )}
      />
      <Text color="error">
        {errors.message?.message ?? validationErrors?.message?.[0]}
      </Text>
      <Button onPress={onSubmit} isLoading={loading} className="mt-4">
        Submit
      </Button>
    </KeyboardAwareScrollView>
  );
}
