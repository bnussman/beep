import React, { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { trpc } from "@/utils/trpc";
import type { TextInput } from "react-native";

export function ChangePasswordScreen() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    mutateAsync: changePassword,
    isPending
  } = trpc.auth.changePassword.useMutation({
    onSuccess() {
      alert("Successfully changed password.");
      setPassword("");
      setConfirmPassword("");
    },
    onError(error) {
      alert(error.message)
    }
  });

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      return alert('Passwords did not match.');
    }

    changePassword({ password });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ padding: 16 }}
      scrollEnabled={false}
    >
      <Label htmlFor="password1">New Password</Label>
      <Input
        id="password1"
        secureTextEntry={true}
        textContentType="password"
        placeholder="New Password"
        onChangeText={(text) => setPassword(text)}
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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
        onSubmitEditing={handlePasswordChange}
      />
      <Button
        onPress={handlePasswordChange}
        disabled={!password || password !== confirmPassword}
        isLoading={isPending}
        style={{ marginTop: 16 }}
      >
        Change Password
      </Button>
    </KeyboardAwareScrollView>
  );
}
