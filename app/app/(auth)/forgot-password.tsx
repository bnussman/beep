import React, { useState } from "react";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { View } from "react-native";
import { Button } from "@/components/Button";
import { TextField } from "heroui-native";

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
      <TextField>
        <Label>Email</Label>
        <Input
          textContentType="emailAddress"
          placeholder="example@ridebeep.app"
          returnKeyType="go"
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={() => sendForgotEmail({ email })}
        />
      </TextField>
      <Button isLoading={isPending} isDisabled={!email}>
        Click me
      </Button>
    </KeyboardAwareScrollView>
  );
}
