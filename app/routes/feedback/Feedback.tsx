import React from "react";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Controller, useForm } from "react-hook-form";
import { Alert, Linking, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { ORPCError } from "@orpc/client";

export function Feedback() {
  const {
    mutateAsync: createFeedback,
    isPending,
    error,
  } = useMutation(
    orpc.feedback.createFeedback.mutationOptions({
      onSuccess() {
        Alert.alert(
          "Thank you for your feedback!",
          "We will contact you if we have any further questions",
        );
        reset();
      },
      onError(error) {
        if (error instanceof ORPCError && error.data?.issues) {
          for (const issue of error.data?.issues) {
            setError(issue.path[0], {
              message: issue.message,
            });
          }
        } else {
          alert(error.message);
        }
      },
    }),
  );

  const {
    control,
    handleSubmit,
    reset,
    setError,
  } = useForm({
    defaultValues: { message: "" },
  });

  const onSubmit = handleSubmit((values) => createFeedback(values));

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ padding: 16, gap: 8 }}
      scrollEnabled={false}
    >
      <Card
        pressable
        onPress={() =>
          Linking.openURL(
            "https://apps.apple.com/us/app/ride-beep-app/id1528601773",
          )
        }
      >
        <Text>
          Please submit your ideas, bugs, and feature requests here! If you like
          the app, please consider clicking here to leave us an App Store
          rating.
        </Text>
      </Card>
      <View style={{ gap: 4 }}>
        <Label htmlFor="feedback-input">Feedback</Label>
        <Controller
          name="message"
          rules={{ required: "Message is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <>
              <Input
                id="feeback-input"
                multiline
                numberOfLines={4}
                style={{ minHeight: 150 }}
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
              />
              <Text color="error">
                {fieldState.error?.message}
              </Text>
            </>
          )}
        />
      </View>
      <Button onPress={onSubmit} isLoading={isPending}>
        Submit
      </Button>
    </KeyboardAwareScrollView>
  );
}
