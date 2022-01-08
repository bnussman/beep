import React, { useRef, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ChangePasswordMutation } from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";
import { Input, Button, Stack } from "native-base";
import { Container } from "../../components/Container";

interface Props {
  navigation: Navigation;
}

const ChangePassword = gql`
  mutation ChangePassword($password: String!) {
    changePassword(input: { password: $password })
  }
`;

export function ChangePasswordScreen(props: Props): JSX.Element {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [changePassword, { loading }] =
    useMutation<ChangePasswordMutation>(ChangePassword);
  const confirmPasswordRef = useRef<any>();

  async function handleChangePassword() {
    try {
      await changePassword({
        variables: {
          password: password,
        },
      });
      alert("Successfully changed your password.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <Container alignItems="center">
      <Stack alignSelf="center" space={4} mt={4} w="90%">
        <Input
          secureTextEntry={true}
          textContentType="password"
          placeholder="New Password"
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={() => confirmPasswordRef.current.focus()}
          returnKeyType="next"
        />
        <Input
          ref={confirmPasswordRef}
          secureTextEntry={true}
          textContentType="password"
          placeholder="New Password"
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
