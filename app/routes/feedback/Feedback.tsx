import React from "react";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Controller, useForm } from "react-hook-form";
import { Alert, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { trpc } from "@/utils/trpc";

export function Feedback() {
  const {
    mutateAsync: createFeedback,
    isPending,
    error
  } = trpc.feedback.createFeedback.useMutation({
    onSuccess() {
      Alert.alert(
        "Thank you for your feedback!",
        "We will contact you if we have any further questions",
      );
      reset();
    },
    onError(error) {
      alert(error.message);
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { message: "" }
  });

  const validationErrors = error?.data?.zodError?.fieldErrors;

  const onSubmit = handleSubmit((values) => createFeedback(values));

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
      <Button onPress={onSubmit} isLoading={isPending} className="mt-4">
        Submit
      </Button>
    </KeyboardAwareScrollView>
  );
}
