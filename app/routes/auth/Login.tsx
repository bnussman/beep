import React, { useEffect, useRef, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PasswordInput from "../../components/PasswordInput";
import { Alert } from "../../utils/Alert";
import { GradietnButton } from "../../components/GradientButton";
import { isMobile } from "../../utils/constants";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { LoginMutation } from "../../generated/graphql";
import { client, wsLink } from "../../utils/Apollo";
import { getPushToken } from "../../utils/Notifications";
import { Navigation } from "../../utils/Navigation";
import { Container } from "../../components/Container";
import { UserData } from "../../utils/useUser";
import { Stack, Button, Input, Heading, Flex, Spacer, Box } from "native-base";
import { Logger } from "../../utils/Logger";

interface Props {
  navigation: Navigation;
}

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
        photoUrl
        capacity
        masksRequired
        cashapp
      }
    }
  }
`;

export function LoginScreen(props: Props) {
  const [login, { loading }] = useMutation<LoginMutation>(Login);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const passwordRef = useRef<any>();

  useEffect(() => {
    try {
      SplashScreen.hideAsync();
    } catch (error) {
      // ...
    }
  }, []);

  const onLogin = async () => {
    let pushToken: string | null;
    try {
      pushToken = isMobile ? await getPushToken() : null;
    } catch (error) {
      Logger.error(error);
      pushToken = null;
    }

    login({
      variables: { username, password, pushToken },
    })
      .then(async (data) => {
        await AsyncStorage.setItem("auth", JSON.stringify(data.data?.login));

        client.writeQuery({
          query: UserData,
          data: { getUser: { ...data.data?.login.user, pushToken } },
        });

        wsLink.client.restart();
      })
      .catch((error: ApolloError) => {
        Alert(error);
      });
  };

  return (
    <Container keyboard center>
      <Stack space={4} w="90%">
        <Box>
          <Heading size="xl" mr={4} fontWeight="extrabold">
            Welcome
          </Heading>
          <Heading size="xl" mr={4} fontWeight="extrabold">
            to Ride Beep App
          </Heading>
        </Box>
        <Stack space={2}>
          <Input
            size="lg"
            textContentType="username"
            placeholder="Username or Email"
            returnKeyType="next"
            onChangeText={(text: string) => setUsername(text)}
            onSubmitEditing={() => passwordRef?.current?.focus()}
            autoCapitalize="none"
          />
          <PasswordInput
            size="lg"
            placeholder="Password"
            returnKeyType="go"
            onChangeText={(text: string) => setPassword(text)}
            ref={passwordRef}
            onSubmitEditing={onLogin}
            textContentType="password"
            autoCapitalize="none"
          />
          <Button
            isLoading={loading}
            isDisabled={!username || !password}
            onPress={onLogin}
          >
            Login
          </Button>
        </Stack>
        <Flex direction="row">
          <GradietnButton
            size="sm"
            onPress={() => props.navigation.navigate("Sign Up")}
          >
            Sign Up
          </GradietnButton>
          <Spacer />
          <Button onPress={() => props.navigation.navigate("Forgot Password")}>
            Forgot Password
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}
