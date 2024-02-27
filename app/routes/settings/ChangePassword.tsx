import React, { useRef, useState } from "react";
import { ApolloError, useMutation } from "@apollo/client";
import { Input, Button, Stack, Label, Spinner } from "@beep/ui";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { graphql } from 'gql.tada';

const ChangePassword = graphql(`
  mutation ChangePassword($password: String!) {
    changePassword(input: { password: $password })
  }
`);

export function ChangePasswordScreen() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [changePassword, { loading }] = useMutation(ChangePassword);
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
    <Container keyboard alignItems="center" px="$4">
      <Stack alignSelf="center" w="100%">
        <Label htmlFor="password1">New Password</Label>
        <Input
          id="password1"
          secureTextEntry={true}
          textContentType="password"
          placeholder="New Password"
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={() => confirmPasswordRef.current.focus()}
          returnKeyType="next"
        />
        <Label htmlFor="password1">Repeat Password</Label>
        <Input
          id="password2"
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
          disabled={!password || password !== confirmPassword}
          iconAfter={loading ? <Spinner /> : undefined}
          mt="$4"
        >
          Change Password
        </Button>
      </Stack>
    </Container>
  );
}
