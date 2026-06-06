import React, { useState } from "react";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { Description, TextField } from "heroui-native";

export default function ForgotPasswordScreen() {
  const trpc = useTRPC();

  const [email, setEmail] = useState<string>("");

  const { mutate: sendForgotEmail, isPending } = useMutation(
    trpc.auth.forgotPassword.mutationOptions({
      onSuccess() {
        alert(
          "Success! Please Check your email 📧\nWe sent you a link to a page where you can reset your password.",
        );
        setEmail("");
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const onSubmit = () => {
    sendForgotEmail({ email });
  };

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
          value={email}
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={onSubmit}
        />
      </TextField>
      <Description>
        We will send you an email with a link to reset your password.
      </Description>
      <Button isLoading={isPending} isDisabled={!email} onPress={onSubmit}>
        Reset Password
      </Button>
    </KeyboardAwareScrollView>
  );
}
