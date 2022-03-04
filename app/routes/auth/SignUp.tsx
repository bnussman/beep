import React, { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import { getPushToken } from "../../utils/Notifications";
import { gql, useMutation } from "@apollo/client";
import { Scalars, SignUpMutation } from "../../generated/graphql";
import { isMobile } from "../../utils/config";
import { generateRNFile } from "../settings/EditProfile";
import { client, wsLink } from "../../utils/Apollo";
import { Navigation } from "../../utils/Navigation";
import { Container } from "../../components/Container";
import { UserData } from "../../App";
import {
  Avatar,
  Button,
  Input,
  Text,
  Flex,
  Box,
  VStack,
  Center,
} from "native-base";
import { Alert } from "../../utils/Alert";

interface Props {
  navigation: Navigation;
}

const SignUp = gql`
  mutation SignUp(
    $first: String!
    $last: String!
    $email: String!
    $phone: String!
    $venmo: String
    $cashapp: String
    $username: String!
    $password: String!
    $picture: Upload!
    $pushToken: String
  ) {
    signup(
      input: {
        first: $first
        last: $last
        email: $email
        phone: $phone
        venmo: $venmo
        cashapp: $cashapp
        username: $username
        password: $password
        picture: $picture
        pushToken: $pushToken
      }
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
        pushToken
      }
    }
  }
`;

let picture: Scalars["Upload"];

export function SignUpScreen(props: Props): JSX.Element {
  const [first, setFirst] = useState<string>("");
  const [last, setLast] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [venmo, setVenmo] = useState<string>();
  const [cashapp, setCashapp] = useState<string>();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [photo, setPhoto] = useState<any>();

  const lastRef = useRef<any>();
  const emailRef = useRef<any>();
  const phoneRef = useRef<any>();
  const venmoRef = useRef<any>();
  const cashappRef = useRef<any>();
  const usernameRef = useRef<any>();
  const passwordRef = useRef<any>();

  const [signup, { loading }] = useMutation<SignUpMutation>(SignUp);

  const handleSignUp = async () => {
    if (!picture) {
      return alert("Please choose a profile photo!");
    }

    const pushToken = isMobile ? await getPushToken() : undefined;

    signup({
      variables: {
        first,
        last,
        email,
        phone,
        venmo,
        cashapp,
        username,
        password,
        picture,
        pushToken,
      },
    })
      .then(async (data) => {
        await AsyncStorage.setItem("auth", JSON.stringify(data.data?.signup));

        client.writeQuery({
          query: UserData,
          data: { getUser: data.data?.signup.user },
        });

        wsLink.client.restart();

        props.navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      })
      .catch((error) => Alert(error));
  };

  const chooseProfilePhoto = async () => {
    setPhoto(null);
    picture = null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });

    if (result.cancelled) {
      return;
    }

    if (!isMobile) {
      const res = await fetch(result.uri);
      const blob = await res.blob();
      const fileType = blob.type.split("/")[1];
      const file = new File([blob], "photo." + fileType);
      picture = file;
      setPhoto(result);
    } else {
      if (!result.cancelled) {
        setPhoto(result);
        const file = generateRNFile(result.uri, "file.jpg");
        picture = file;
      }
    }
  };

  const isDisabled =
    !first || !last || !email || !phone || !username || !password || !picture;

  return (
    <Container keyboard alignItems="center">
      <VStack space={4} w="90%" mt={4}>
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box width="70%">
            <Input
              size="lg"
              textContentType="givenName"
              placeholder="First Name"
              returnKeyType="next"
              onChangeText={(text) => setFirst(text)}
              onSubmitEditing={() => lastRef.current.focus()}
              mb={4}
            />
            <Input
              size="lg"
              ref={lastRef}
              textContentType="familyName"
              placeholder="Last Name"
              returnKeyType="next"
              onChangeText={(text) => setLast(text)}
              onSubmitEditing={() => emailRef.current.focus()}
            />
          </Box>
          <TouchableOpacity onPress={chooseProfilePhoto}>
            <Avatar source={photo} size="xl" />
          </TouchableOpacity>
        </Flex>
        <Input
          size="lg"
          ref={emailRef}
          textContentType="emailAddress"
          placeholder="Email"
          returnKeyType="next"
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={() => phoneRef.current.focus()}
        />
        <Input
          size="lg"
          ref={phoneRef}
          textContentType="telephoneNumber"
          placeholder="Phone Number"
          returnKeyType="next"
          onChangeText={(text) => setPhone(text)}
          onSubmitEditing={() => venmoRef.current.focus()}
        />
        <Input
          size="lg"
          ref={venmoRef}
          textContentType="username"
          placeholder="Venmo"
          returnKeyType="next"
          onChangeText={(text) => setVenmo(text)}
          onSubmitEditing={() => cashappRef.current.focus()}
        />
        <Input
          size="lg"
          ref={cashappRef}
          textContentType="username"
          placeholder="Cash App"
          returnKeyType="next"
          onChangeText={(text) => setCashapp(text)}
          onSubmitEditing={() => usernameRef.current.focus()}
        />
        <Input
          size="lg"
          ref={usernameRef}
          textContentType="username"
          placeholder="Username"
          returnKeyType="next"
          onChangeText={(text) => setUsername(text)}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <Input
          size="lg"
          ref={passwordRef}
          textContentType="password"
          placeholder="Password"
          returnKeyType="go"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={handleSignUp}
        />
        <Button
          isLoading={loading}
          isDisabled={isDisabled}
          onPress={handleSignUp}
        >
          Sign Up
        </Button>
        <Center>
          <Text>By signing up, you agree to our </Text>
          <Flex direction="row">
            <Text
              bold
              onPress={() => Linking.openURL("https://ridebeep.app/privacy")}
            >
              Privacy Policy
            </Text>
            <Text> and </Text>
            <Text
              bold
              onPress={() => Linking.openURL("https://ridebeep.app/terms")}
            >
              Terms of Service
            </Text>
          </Flex>
        </Center>
      </VStack>
    </Container>
  );
}
