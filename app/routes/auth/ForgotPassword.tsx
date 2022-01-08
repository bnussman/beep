import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { ForgotPasswordMutation } from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";
import { isMobile } from "../../utils/config";
import { Input, Button } from "native-base";
import { Container } from "../../components/Container";

interface Props {
  navigation: Navigation;
}

const ForgotPassword = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export function ForgotPasswordScreen(props: Props): JSX.Element {
  const [forgot, { loading }] =
    useMutation<ForgotPasswordMutation>(ForgotPassword);
  const [email, setEmail] = useState<string>("");

  async function handleForgotPassword() {
    try {
      await forgot({
        variables: { email },
      });

      alert("Check your email for a link to reset your password");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!isMobile}>
        <>
          <Input
            textContentType="emailAddress"
            placeholder="example@ridebeep.app"
            returnKeyType="go"
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => handleForgotPassword()}
          />
          <Button
            isLoading={loading}
            onPress={() => handleForgotPassword()}
            disabled={!email}
          >
            Send Password Reset Email
          </Button>
        </>
      </TouchableWithoutFeedback>
    </Container>
  );
}
