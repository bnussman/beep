import React, { useRef, useState } from "react";
import { ApolloError, useMutation } from "@apollo/client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Alert } from "../../utils/alert";
import { graphql } from "gql.tada";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
    <KeyboardAwareScrollView
      contentContainerClassName="p-4"
      scrollEnabled={false}
    >
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
        isLoading={loading}
        className="mt-4"
      >
        Change Password
      </Button>
    </KeyboardAwareScrollView>
  );
}
