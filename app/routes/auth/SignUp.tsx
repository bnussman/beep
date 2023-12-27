import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import { getPushToken } from "../../utils/Notifications";
import { ApolloError, gql, useMutation } from "@apollo/client";
import {
  SignUpInput,
  SignUpMutation,
  SignUpMutationVariables,
} from "../../generated/graphql";
import { isMobile, isSimulator } from "../../utils/constants";
import { generateRNFile } from "../settings/EditProfile";
import { client } from "../../utils/Apollo";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { UserData } from "../../utils/useUser";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "../../components/Avatar";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  Button,
  Input,
  Text,
  XStack,
  Stack,
  Label,
} from "tamagui";

const SignUp = gql`
  mutation SignUp($input: SignUpInput!) {
    signup(input: $input) {
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

let picture: SignUpMutationVariables["input"]["picture"];

export function SignUpScreen() {
  const [signup, { error }] = useMutation<SignUpMutation>(SignUp, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
  });

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>();

  const validationErrors = useValidationErrors<SignUpInput>(error);

  const [photo, setPhoto] = useState<any>();

  const onSubmit = handleSubmit(async (variables) => {
    try {
      const pushToken = isMobile && !isSimulator ? await getPushToken() : null;

      const { data } = await signup({
        variables: { input: { ...variables, picture, pushToken } },
      });

      await AsyncStorage.setItem("auth", JSON.stringify(data?.signup));

      client.writeQuery({
        query: UserData,
        data: { getUser: { ...data?.signup.user, pushToken } },
      });
    } catch (error) {
      if (!isValidationError(error as ApolloError)) {
        Alert(error as ApolloError);
      }
    }
  });

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

    if (result.canceled) {
      return;
    }

    if (!isMobile) {
      const res = await fetch(result.assets[0].uri);
      const blob = await res.blob();
      const fileType = blob.type.split("/")[1];
      const file = new File([blob], "photo." + fileType);
      picture = file;
      setPhoto(result.assets[0]);
    } else {
      if (!result.canceled) {
        setPhoto(result.assets[0]);
        const file = generateRNFile(result.assets[0].uri, "file.jpg");
        picture = file;
      }
    }
  };

  return (
    <Container
      keyboard
      alignItems="center"
      scrollViewProps={{ bounces: false, scrollEnabled: true }}
      px="$4"
    >
      <Stack space={2} w="100%" mt={4}>
        <XStack space={4} alignItems="center">
          <Stack space={2} flexGrow={1}>
              <Label>First Name</Label>
              <Controller
                name="first"
                rules={{ required: "First name is required" }}
                defaultValue=""
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(val)}
                    value={value}
                    ref={ref}
                    returnKeyLabel="next"
                    returnKeyType="next"
                    onSubmitEditing={() => setFocus("last")}
                    textContentType="givenName"
                    size="lg"
                  />
                )}
              />
              <Text
              >
                {errors.first?.message}
                {validationErrors?.first?.[0]}
              </Text>
              <Label>Last Name</Label>
              <Controller
                name="last"
                rules={{ required: "Last name is required" }}
                defaultValue=""
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    onBlur={onBlur}
                    textContentType="familyName"
                    onChangeText={(val) => onChange(val)}
                    value={value}
                    ref={ref}
                    returnKeyLabel="next"
                    returnKeyType="next"
                    onSubmitEditing={() => setFocus("email")}
                    size="lg"
                  />
                )}
              />
              <Text
              >
                {errors.last?.message}
                {validationErrors?.last?.[0]}
              </Text>
          </Stack>
          <TouchableOpacity onPress={chooseProfilePhoto}>
            <Avatar url={photo?.uri} size="xl" />
          </TouchableOpacity>
          <Text>
            {errors.picture?.message}
            {validationErrors?.picture?.[0]}
          </Text>
        </XStack>
          <Label>Email</Label>
          <Controller
            name="email"
            rules={{ required: "Email is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                onBlur={onBlur}
                textContentType="emailAddress"
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("phone")}
                autoCapitalize="none"
                size="lg"
              />
            )}
          />
          <Text>
            You must a .edu email address
            {errors.email?.message}
            {validationErrors?.email?.[0]}
          </Text>
          <Label>Phone</Label>
          <Controller
            name="phone"
            rules={{ required: "Phone number is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                onBlur={onBlur}
                textContentType="telephoneNumber"
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("venmo")}
                size="lg"
              />
            )}
          />
          <Text>
            {errors.phone?.message}
            {validationErrors?.phone?.[0]}
          </Text>
          <Label>Venmo Username</Label>
          <Controller
            name="venmo"
            rules={{ required: "Venmo username is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  flexGrow={1}
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value as string | undefined}
                  ref={ref}
                  returnKeyLabel="next"
                  returnKeyType="next"
                  textContentType="username"
                  onSubmitEditing={() => setFocus("username")}
                  autoCapitalize="none"
                  size="lg"
                />
            )}
          />
          <Text>
            {errors.venmo?.message}
            {validationErrors?.venmo?.[0]}
          </Text>
          <Label>Username</Label>
          <Controller
            name="username"
            rules={{ required: "Username is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                autoCapitalize="none"
                textContentType="username"
                onSubmitEditing={() => setFocus("password")}
                size="lg"
              />
            )}
          />
          <Text>
            {errors.username?.message}
            {validationErrors?.username?.[0]}
          </Text>
          <Label>Password</Label>
          <Controller
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be longer than 5 characters",
              },
            }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyLabel="sign up"
                returnKeyType="go"
                secureTextEntry={true}
                onSubmitEditing={onSubmit}
                textContentType="password"
                size="lg"
              />
            )}
          />
          <Text>
            {errors.password?.message}
            {validationErrors?.password?.[0]}
          </Text>
        <Button onPress={onSubmit} mt={2}>
          Sign Up
        </Button>
        <Stack>
          <Text>By signing up, you agree to our </Text>
          <Stack mb={8}>
            <Text
              onPress={() => Linking.openURL("https://ridebeep.app/privacy")}
            >
              Privacy Policy
            </Text>
            <Text> and </Text>
            <Text
              onPress={() => Linking.openURL("https://ridebeep.app/terms")}
            >
              Terms of Service
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
