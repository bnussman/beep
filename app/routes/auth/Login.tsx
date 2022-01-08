import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { isMobile } from "../../utils/config";
import { gql, useMutation } from "@apollo/client";
import { LoginMutation } from "../../generated/graphql";
import { client } from "../../utils/Apollo";
import { getPushToken } from "../../utils/Notifications";
import { Navigation } from "../../utils/Navigation";
import { Container } from "../../components/Container";
import { UserSubscription } from "../../App";
import {
  Stack,
  Button,
  Input,
  Center,
  Heading,
  Flex,
  Spacer,
} from "native-base";

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

function LoginScreen(props: Props): JSX.Element {
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

  async function doLogin() {
    try {
      const data = await login({
        variables: {
          username: username,
          password: password,
          pushToken: isMobile ? await getPushToken() : undefined,
        },
      });

      AsyncStorage.setItem("auth", JSON.stringify(data.data?.login));

      client.writeQuery({
        query: UserSubscription,
        data: { getUserUpdates: data.data?.login.user },
      });

      props.navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Container>
      <Center mt="40%">
        <Stack space={4} w="90%">
          <Flex direction="row" alignItems="center" justifyContent="center">
            <Heading mr={4}>Login</Heading>
          </Flex>
          <Stack space={2}>
            <Input
              textContentType="username"
              placeholder="Username"
              returnKeyType="next"
              onChangeText={(text) => setUsername(text)}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
            <Input
              textContentType="password"
              placeholder="Password"
              returnKeyType="go"
              onChangeText={(text) => setPassword(text)}
              ref={passwordRef}
              onSubmitEditing={() => doLogin()}
              secureTextEntry
            />
            <Button
              isLoading={loading}
              isDisabled={!username || !password}
              onPress={() => doLogin()}
            >
              Login
            </Button>
          </Stack>
          <Flex direction="row">
            <Button onPress={() => props.navigation.navigate("Sign Up")}>
              Sign Up
            </Button>
            <Spacer />
            <Button
              onPress={() => props.navigation.navigate("Forgot Password")}
            >
              Forgot Password
            </Button>
          </Flex>
        </Stack>
      </Center>
    </Container>
  );
}

export default LoginScreen;
