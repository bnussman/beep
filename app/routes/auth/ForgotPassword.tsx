import React, { useState } from "react";
import { ApolloError, useMutation } from "@apollo/client";
import { Input, Button, Stack } from "native-base";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
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
      <Stack mt={4} space={4} w="90%">
        <Input
          size="lg"
          textContentType="emailAddress"
          placeholder="example@ridebeep.app"
          returnKeyType="go"
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={handleForgotPassword}
        />
        <Button
          isLoading={loading}
          isDisabled={!email}
          onPress={handleForgotPassword}
        >
          Send Password Reset Email
        </Button>
      </Stack>
    </Container>
  );
}
