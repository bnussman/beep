import React, { useRef, useState } from "react";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { ChangePasswordMutation } from "../../generated/graphql";
import { Input, Button, Stack } from "native-base";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";

const ChangePassword = gql`
  mutation ChangePassword($password: String!) {
    changePassword(input: { password: $password })
  }
`;

export function ChangePasswordScreen(): JSX.Element {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [changePassword, { loading }] =
    useMutation<ChangePasswordMutation>(ChangePassword);
  const confirmPasswordRef = useRef<any>();

  async function handleChangePassword() {
    changePassword({
      variables: {
        password: password,
      },
    })
      .then(() => {
        alert("Successfully changed your password.");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((error: ApolloError) => {
        Alert(error);
      });
  }

  return (
    <Container keyboard alignItems="center">
      <Stack alignSelf="center" space={4} mt={4} w="90%">
        <Input
          size="lg"
          secureTextEntry={true}
          textContentType="password"
          placeholder="New Password"
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={() => confirmPasswordRef.current.focus()}
          returnKeyType="next"
        />
        <Input
          size="lg"
          ref={confirmPasswordRef}
          secureTextEntry={true}
          textContentType="password"
          placeholder="Confirm Password"
          returnKeyType="go"
          onChangeText={(text) => setConfirmPassword(text)}
          onSubmitEditing={() => handleChangePassword()}
        />
        <Button
          onPress={() => handleChangePassword()}
          isDisabled={!password || password !== confirmPassword}
          isLoading={loading}
        >
          Change Password
        </Button>
      </Stack>
    </Container>
  );
}
