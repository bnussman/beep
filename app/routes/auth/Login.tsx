import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PasswordInput from "../../components/PasswordInput";
import { Alert } from "../../utils/Alert";
import { isSimulator } from "../../utils/constants";
import { ApolloError, useMutation } from "@apollo/client";
import { client } from "../../utils/Apollo";
import { getPushToken } from "../../utils/Notifications";
import { Container } from "../../components/Container";
import { UserData } from "../../utils/useUser";
import { Logger } from "../../utils/Logger";
import { useValidationErrors } from "../../utils/useValidationErrors";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { VariablesOf, graphql } from "gql.tada";
import {
  Button,
  Input,
  Heading,
  Stack,
  XStack,
  Spinner,
  Label,
  SizableText
} from "@beep/ui";

const Login = graphql(`
  mutation Login($username: String!, $password: String!, $pushToken: String) {
    login(
      input: { username: $username, password: $password, pushToken: $pushToken }
    ) {
      tokens {
        id
        tokenid
      }
      user {
        id
        username
        name
        first
        last
        email
        phone
        venmo
        isBeeping
        isEmailVerified
        isStudent
        groupRate
        singlesRate
        photo
        capacity
        cashapp
      }
    }
  }
`);

type Values = VariablesOf<typeof Login>;

export function LoginScreen() {
  const [login, { error }] = useMutation(Login);

  const validationErrors = useValidationErrors<Values>(error);

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
      const { data } = await login({
        variables: { ...variables, pushToken },
      });

      await AsyncStorage.setItem("auth", JSON.stringify(data?.login));

      client.writeQuery({
        query: UserData,
        data: { getUser: { ...data?.login.user } },
      });
    } catch (error) {
      Alert(error as ApolloError);
    }
  });

  return (
    <Container
      keyboard
      center
      scrollViewProps={{ scrollEnabled: true, bounces: false }}
    >
      <Stack w="90%" gap="$2">
        <Heading size="$10" fontWeight="bold">
          Ride Beep App 🚕
        </Heading>
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
        <SizableText>
          {errors.username?.message}
          {validationErrors?.username?.[0]}
        </SizableText>
        <Label htmlFor="password">Password</Label>
        <Controller
          name="password"
          rules={{ required: "Password is required" }}
          defaultValue=""
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <PasswordInput
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={(val: string) => onChange(val)}
              value={value}
              ref={ref}
              returnKeyLabel="login"
              returnKeyType="go"
              onSubmitEditing={onLogin}
              textContentType="password"
            />
          )}
        />
        <SizableText>
          {errors.password?.message}
          {validationErrors?.password?.[0]}
        </SizableText>
        <Button
          icon={isSubmitting ? <Spinner /> : undefined}
          onPress={onLogin}
        >
          Login
        </Button>
        <XStack justifyContent="space-between">
          <Button onPress={() => navigation.navigate("Sign Up")}>
            Sign Up
          </Button>
          <Button onPress={() => navigation.navigate("Forgot Password")}>
            Forgot Password
          </Button>
        </XStack>
      </Stack>
    </Container>
  );
}
