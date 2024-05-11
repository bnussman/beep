import React, { useState } from "react";
import { ApolloError, useMutation } from "@apollo/client";
import { View } from "react-native";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { graphql } from "gql.tada";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ForgotPassword = graphql(`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`);

export function ForgotPasswordScreen() {
  const [forgot, { loading }] = useMutation(ForgotPassword);

  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = () => {
    forgot({
      variables: { email },
    })
      .then(() => alert("Check your email for a link to reset your password!"))
      .catch((error: ApolloError) => alert(error.message));
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
        isLoading={loading}
        disabled={!email}
        onPress={handleForgotPassword}
        className="mt-4"
      >
        Send Password Reset Email
      </Button>
    </KeyboardAwareScrollView>
  );
}
