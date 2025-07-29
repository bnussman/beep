import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PasswordInput } from "@/components/PasswordInput";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { isSimulator } from "../../utils/constants";
import { getPushToken } from "../../utils/notifications";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Logger } from "../../utils/logger";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { RouterInput, useTRPC } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

type Values = RouterInput['auth']['login'];

export function LoginScreen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: login, error } = useMutation(trpc.auth.login.mutationOptions());

  const validationErrors = error?.data?.fieldErrors;

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Values, "pushToken">>();

  useEffect(() => {
    try {
      SplashScreen.hideAsync();
    } catch (error) {
      // ...
    }
  }, []);

  const onLogin = handleSubmit(async (variables) => {
    let pushToken: string | null;
    try {
      pushToken = !isSimulator ? await getPushToken() : null;
    } catch (error) {
      alert(error);
      Logger.error(error);
      pushToken = null;
    }

    try {
      const data = await login({
        ...variables,
        pushToken,
      });

      await AsyncStorage.setItem("auth", JSON.stringify(data));

      queryClient.setQueryData(trpc.user.me.queryKey(), data.user);

    } catch (error) {
      alert((error as TRPCClientError<any>).message);
    }
  });

  return (
    <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={{ display: 'flex', justifyContent: 'center', gap: 8, height: '100%', padding: 16 }}>
      <Text size="4xl" weight="800">
        Ride Beep App 🚕
      </Text>
      <Label htmlFor="username">Username or Email</Label>
      <Controller
        name="username"
        rules={{ required: "Username or Email is required" }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            id="username"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={(val) => onChange(val)}
            value={value}
            ref={ref}
            returnKeyLabel="next"
            returnKeyType="next"
            onSubmitEditing={() => setFocus("password")}
            textContentType="username"
          />
        )}
      />
      <Text color="error">
        {errors.username?.message}
        {validationErrors?.username?.[0]}
      </Text>
      <Label htmlFor="password">Password</Label>
      <Controller
        name="password"
        rules={{ required: "Password is required" }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <PasswordInput
            id="password"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={(val: string) => onChange(val)}
            value={value}
            inputRef={ref}
            returnKeyLabel="login"
            returnKeyType="go"
            onSubmitEditing={onLogin}
            textContentType="password"
          />
        )}
      />
      <Text color="error">
        {errors.password?.message}
        {validationErrors?.password?.[0]}
      </Text>
      <Button isLoading={isSubmitting} onPress={onLogin}>
        Login
      </Button>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          variant="secondary"
          onPress={() => navigation.navigate("Sign Up")}
        >
          Sign Up
        </Button>
        <Button
          variant="secondary"
          onPress={() => navigation.navigate("Forgot Password")}
        >
          Forgot Password
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
