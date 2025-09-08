import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTRPC } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

import { useMutation } from "@tanstack/react-query";
import { View } from "react-native";

export function ForgotPasswordScreen() {
  const trpc = useTRPC();
  const { mutateAsync: sendForgotEmail, isPending } = useMutation(
    trpc.auth.forgotPassword.mutationOptions(),
  );

  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = () => {
    sendForgotEmail({ email })
      .then(() => alert("Check your email for a link to reset your password!"))
      .catch((error: TRPCClientError<any>) => alert(error.message));
  };

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
          onSubmitEditing={handleForgotPassword}
        />
      </View>
      <Button
        isLoading={isPending}
        disabled={!email}
        onPress={handleForgotPassword}
      >
        Send Password Reset Email
      </Button>
    </KeyboardAwareScrollView>
  );
}
