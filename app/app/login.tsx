import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { PasswordInput } from "@/components/PasswordInput";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { getPushToken } from "../utils/notifications";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { RouterInput, useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";

type Values = RouterInput["auth"]["login"];

export default function LoginScreen() {
  const trpc = useTRPC();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>();

  const { mutate: login } = useMutation(
    trpc.auth.login.mutationOptions({
      async onSuccess(data, variables, result, context) {
        await AsyncStorage.setItem("auth", JSON.stringify(data));

        context.client.setQueryData(trpc.user.me.queryKey(), data.user);
      },
      onError(error) {
        if (error.data?.fieldErrors) {
          for (const key in error.data.fieldErrors) {
            setError(key as keyof Values, { message: error.data.fieldErrors[key]?.[0] });
          }
        } else {
          alert(error.message);
        }
      },
    }),
  );


  useEffect(() => {
    try {
      SplashScreen.hideAsync();
    } catch (error) {
      // ...
    }
  }, []);

  const onLogin = handleSubmit(async (variables) => {
    login({
      ...variables,
      pushToken: await getPushToken(),
    });
  });

  return (
    <KeyboardAwareScrollView
      scrollEnabled={false}
      contentContainerStyle={{
        display: "flex",
        justifyContent: "center",
        gap: 8,
        height: "100%",
        padding: 16,
      }}
    >
      <Text size="4xl" weight="800">
        Ride Beep App 🚕
      </Text>
      <View style={{ gap: 4 }}>
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
              onChangeText={onChange}
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
        </Text>
      </View>
      <View style={{ gap: 4 }}>
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
              onChangeText={onChange}
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
        </Text>
      </View>
      <Button isLoading={isSubmitting} onPress={onLogin}>
        Login
      </Button>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
