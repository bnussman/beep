import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { trpc } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

export function ForgotPasswordScreen() {
  const { mutateAsync: sendForgotEmail, isPending } = trpc.auth.forgotPassword.useMutation();

  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = () => {
    sendForgotEmail({ email })
      .then(() => alert("Check your email for a link to reset your password!"))
      .catch((error: TRPCClientError<any>) => alert(error.message));
  };

  return (
    <KeyboardAwareScrollView scrollEnabled={false} className="p-4">
      <Label>Email</Label>
      <Input
        textContentType="emailAddress"
        placeholder="example@ridebeep.app"
        returnKeyType="go"
        onChangeText={(text) => setEmail(text)}
        onSubmitEditing={handleForgotPassword}
      />
      <Button
        isLoading={isPending}
        disabled={!email}
        onPress={handleForgotPassword}
        className="mt-4"
      >
        Send Password Reset Email
      </Button>
    </KeyboardAwareScrollView>
  );
}
