import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PasswordInput } from "../../components/PasswordInput";
import { Alert } from "../../utils/Alert";
import { isSimulator } from "../../utils/constants";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { LoginMutation, LoginMutationVariables } from "../../generated/graphql";
import { client } from "../../utils/Apollo";
import { getPushToken } from "../../utils/Notifications";
import { Navigation } from "../../utils/Navigation";
import { Container } from "../../components/Container";
import { UserData } from "../../utils/useUser";
import { Logger } from "../../utils/Logger";
import { useValidationErrors } from "../../utils/useValidationErrors";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Stack, Input, Label, XStack, H1, SizableText, Spinner } from "tamagui";
import { Button } from "tamagui";

const Login = gql`
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
`;

export function LoginScreen() {
  const [login, { error }] = useMutation<LoginMutation>(Login);

  const validationErrors = useValidationErrors<LoginMutationVariables>(error);

  const navigation = useNavigation<Navigation>();

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<Omit<LoginMutationVariables, "pushToken">>();

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
        data: { getUser: { ...data?.login.user, pushToken } },
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
      <Stack space="$4" width="90%">
        <H1 animation="slow" fontWeight="bold">
          Ride Beep App 🚕
        </H1>
        <Stack space={2}>
          <Label>Username or Email</Label>
          <Controller
            name="username"
            rules={{ required: "Username or Email is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("password")}
                textContentType="username"
                size="lg"
              />
            )}
          />
          <SizableText color="$red9">
            {errors.username?.message}
            {validationErrors?.username?.[0]}
          </SizableText>
          <Label>Password</Label>
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
                inputRef={ref}
                returnKeyLabel="login"
                returnKeyType="go"
                onSubmitEditing={onLogin}
                textContentType="password"
                size="lg"
              />
            )}
          />
          <SizableText color="$red9">
            {errors.password?.message}
            {validationErrors?.password?.[0]}
          </SizableText>
          <Button
            mt="$3"
            onPress={onLogin}
            iconAfter={isSubmitting ? <Spinner /> : undefined}
          >
            Login
          </Button>
        </Stack>
        <XStack justifyContent="space-between">
          <Button onPress={() => navigation.navigate("Sign Up")}>
            Sign Up
          </Button>
          <Stack flexGrow={1} />
          <Button onPress={() => navigation.navigate("Forgot Password")}>
            Forgot Password
          </Button>
        </XStack>
      </Stack>
    </Container>
  );
}
