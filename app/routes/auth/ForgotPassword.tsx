import React, { useState } from "react";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { ForgotPasswordMutation } from "../../generated/graphql";
import { Input, Button, Stack } from "native-base";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";

const ForgotPassword = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export function ForgotPasswordScreen(): JSX.Element {
  const [forgot, { loading }] =
    useMutation<ForgotPasswordMutation>(ForgotPassword);
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
