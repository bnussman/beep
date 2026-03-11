import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { View } from "react-native";

export default function ForgotPasswordScreen() {
  const trpc = useTRPC();

  const { mutate: sendForgotEmail, isPending } = useMutation(
    trpc.auth.forgotPassword.mutationOptions({
      onSuccess() {
        alert("Check your email for a link to reset your password!");
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const [email, setEmail] = useState<string>("");

  return (
    <KeyboardAwareScrollView
      scrollEnabled={false}
      contentContainerStyle={{ padding: 16, gap: 8 }}
    >
      <View style={{ gap: 4 }}>
        <Label>Email</Label>
        <Input
          textContentType="emailAddress"
          placeholder="example@ridebeep.app"
          returnKeyType="go"
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={() => sendForgotEmail({ email })}
        />
      </View>
      <Button
        isLoading={isPending}
        disabled={!email}
        onPress={() => sendForgotEmail({ email })}
      >
        Send Password Reset Email
      </Button>
    </KeyboardAwareScrollView>
  );
}
