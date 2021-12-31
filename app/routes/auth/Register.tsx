import React, { useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPushToken } from "../../utils/Notifications";
import * as Linking from "expo-linking";
import * as ImagePicker from "expo-image-picker";
import { gql, useMutation } from "@apollo/client";
import { SignUpMutation } from "../../generated/graphql";
import { isMobile } from "../../utils/config";
import { generateRNFile } from "../settings/EditProfile";
import { client } from "../../utils/Apollo";
import { GetUserData } from "../../utils/UserQueries";
import { Navigation } from "../../utils/Navigation";
import {
  Avatar,
  Button,
  Stack,
  Input,
  Text,
  Box,
  HStack,
  Center,
} from "native-base";
import { LocalWrapper } from "../../components/Container";

interface Props {
  navigation: Navigation;
}

let real: any;

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
      }
    }
  }
`;

function RegisterScreen(props: Props): JSX.Element {
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

  async function handleSignUp() {
    if (!real) {
      alert("Please choose a profile photo!");
      return;
    }

    try {
      const data = await signup({
        variables: {
          first: first,
          last: last,
          email: email,
          phone: phone,
          venmo: venmo,
          cashapp: cashapp,
          username: username,
          password: password,
          picture: real,
          pushToken: isMobile ? await getPushToken() : undefined,
        },
      });

      AsyncStorage.setItem("auth", JSON.stringify(data.data?.signup));

      client.writeQuery({
        query: GetUserData,
        data: { getUser: data.data?.signup.user },
      });

      props.navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      alert(error.message);
    }
  }

  async function handlePhoto() {
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
      real = file;
      setPhoto(result);
    } else {
      if (!result.cancelled) {
        setPhoto(result);
        const file = generateRNFile(result.uri, "file.jpg");
        real = file;
      }
    }
  }

  return (
    <LocalWrapper>
      <Input
        textContentType="givenName"
        placeholder="Banks"
        returnKeyType="next"
        onChangeText={(text) => setFirst(text)}
        onSubmitEditing={() => lastRef.current.focus()}
      />
      <Input
        ref={lastRef}
        textContentType="familyName"
        placeholder="Nussman"
        returnKeyType="next"
        onChangeText={(text) => setLast(text)}
        onSubmitEditing={() => emailRef.current.focus()}
      />
      <TouchableOpacity onPress={() => handlePhoto()}>
        <Avatar
          source={{ uri: photo?.uri ? photo?.uri : undefined }}
          size={90}
        />
      </TouchableOpacity>
      <Input
        ref={emailRef}
        textContentType="emailAddress"
        placeholder="example@ridebeep.app"
        returnKeyType="next"
        onChangeText={(text) => setEmail(text)}
        onSubmitEditing={() => phoneRef.current.focus()}
      />
      <Input
        ref={phoneRef}
        textContentType="telephoneNumber"
        placeholder="7044043044"
        returnKeyType="next"
        onChangeText={(text) => setPhone(text)}
        onSubmitEditing={() => venmoRef.current.focus()}
      />
      <Input
        ref={venmoRef}
        textContentType="username"
        placeholder="banks"
        returnKeyType="next"
        onChangeText={(text) => setVenmo(text)}
        onSubmitEditing={() => cashappRef.current.focus()}
      />
      <Input
        ref={cashappRef}
        textContentType="username"
        placeholder="banks"
        returnKeyType="next"
        onChangeText={(text) => setCashapp(text)}
        onSubmitEditing={() => usernameRef.current.focus()}
      />
      <Input
        ref={usernameRef}
        textContentType="username"
        placeholder="banksnussman"
        returnKeyType="next"
        onChangeText={(text) => setUsername(text)}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Input
        ref={passwordRef}
        textContentType="password"
        placeholder="Password"
        returnKeyType="go"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        onSubmitEditing={() => handleSignUp()}
      />
      <Button isLoading={loading} onPress={() => handleSignUp()}>
        Sign Up
      </Button>
      <Text>By signing up, you agree to our </Text>
      <Text onPress={() => Linking.openURL("https://ridebeep.app/privacy")}>
        Privacy Policy
      </Text>
      <Text> and </Text>
      <Text onPress={() => Linking.openURL("https://ridebeep.app/terms")}>
        Terms of Service
      </Text>
    </LocalWrapper>
  );
}

export default RegisterScreen;
