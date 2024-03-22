import React, { useState } from "react";
import { ApolloError, useMutation } from "@apollo/client";
import { Input, Button, Stack, Spinner, Label } from "@beep/ui";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/alert";
import { graphql } from "gql.tada";

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
      .catch((error: ApolloError) => Alert(error));
  };

  return (
    <Container alignItems="center" keyboard>
      <Stack w="100%" px="$4" gap="$4">
        <Stack>
          <Label fontWeight="bold">Email</Label>
          <Input
            textContentType="emailAddress"
            placeholder="example@ridebeep.app"
            returnKeyType="go"
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={handleForgotPassword}
          />
        </Stack>
        <Button
          iconAfter={loading ? <Spinner /> : undefined}
          disabled={!email}
          onPress={handleForgotPassword}
        >
          Send Password Reset Email
        </Button>
      </Stack>
    </Container>
  );
}
