import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import { getPushToken } from "../../utils/Notifications";
import { ApolloError, useMutation } from "@apollo/client";
import { isMobile, isSimulator } from "../../utils/constants";
import { generateRNFile } from "../settings/EditProfile";
import { client } from "../../utils/Apollo";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { UserData } from "../../utils/useUser";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "../../components/Avatar";
import { VariablesOf, graphql } from "gql.tada";
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
  Spinner,
} from "@beep/ui";
import { PasswordInput } from "../../components/PasswordInput";

const SignUp = graphql(`
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
`);

let picture: any;

type Values = VariablesOf<typeof SignUp>['input'];

export function SignUpScreen() {
  const [signup, { error }] = useMutation(SignUp, {
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
  } = useForm<Values>();

  const validationErrors = useValidationErrors<Values>(error);

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
        data: { getUser: { ...data?.signup.user } },
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
      <Stack w="100%">
        <XStack gap="$4" alignItems="center">
          <Stack gap="$2" flexGrow={1}>
            <Stack>
              <Label htmlFor="first" fontWeight="bold">First Name</Label>
              <Controller
                name="first"
                rules={{ required: "First name is required" }}
                defaultValue=""
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    id="first"
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(val)}
                    value={value}
                    ref={ref}
                    returnKeyLabel="next"
                    returnKeyType="next"
                    onSubmitEditing={() => setFocus("last")}
                    textContentType="givenName"
                  />
                )}
              />
              <Text color="red">
                {errors.first?.message}
                {validationErrors?.first?.[0]}
              </Text>
            </Stack>
            <Stack>
              <Label htmlFor="last" fontWeight="bold">Last Name</Label>
              <Controller
                name="last"
                rules={{ required: "Last name is required" }}
                defaultValue=""
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    id="last"
                    onBlur={onBlur}
                    textContentType="familyName"
                    onChangeText={(val) => onChange(val)}
                    value={value}
                    ref={ref}
                    returnKeyLabel="next"
                    returnKeyType="next"
                    onSubmitEditing={() => setFocus("email")}
                  />
                )}
              />
              <Text color="red">
                {errors.last?.message}
                {validationErrors?.last?.[0]}
              </Text>
            </Stack>
          </Stack>
          <Stack w="100px">
            <TouchableOpacity onPress={chooseProfilePhoto} aria-label="profile photo">
              <Avatar url={photo?.uri} size="$10"  />
            </TouchableOpacity>
            <Text color="red">
              {errors.picture?.message}
              {validationErrors?.picture?.[0]}
            </Text>
          </Stack>
        </XStack>
        <Stack>
          <Label htmlFor="email" fontWeight="bold">Email</Label>
          <Controller
            name="email"
            rules={{ required: "Email is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="email"
                onBlur={onBlur}
                textContentType="emailAddress"
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("phone")}
                autoCapitalize="none"
              />
            )}
          />
          <Text>
            You must a .edu email address
          </Text>
          <Text color="red">
            {errors.email?.message}
            {validationErrors?.email?.[0]}
          </Text>
        </Stack>
        <Stack>
          <Label htmlFor="phone" fontWeight="bold">Phone</Label>
          <Controller
            name="phone"
            rules={{ required: "Phone number is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="phone"
                onBlur={onBlur}
                textContentType="telephoneNumber"
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("venmo")}
              />
            )}
          />
          <Text color="red">
            {errors.phone?.message}
            {validationErrors?.phone?.[0]}
          </Text>
        </Stack>
        <Stack>
          <Label htmlFor="venmo" fontWeight="bold">Venmo Username</Label>
          <Controller
            name="venmo"
            rules={{ required: "Venmo username is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="venmo"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value as string | undefined}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                textContentType="username"
                onSubmitEditing={() => setFocus("username")}
                autoCapitalize="none"
              />
            )}
          />
          <Text color="red">
            {errors.venmo?.message}
            {validationErrors?.venmo?.[0]}
          </Text>
        </Stack>
        <Stack>
          <Label htmlFor="username-input" fontWeight="bold">Username</Label>
          <Controller
            name="username"
            rules={{ required: "Username is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="username-input"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                autoCapitalize="none"
                textContentType="username"
                onSubmitEditing={() => setFocus("password")}
              />
            )}
          />
          <Text color="red">
            {errors.username?.message}
            {validationErrors?.username?.[0]}
          </Text>
        </Stack>
        <Stack>
          <Label htmlFor="password-input" fontWeight="bold">Password</Label>
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
              <PasswordInput
                id="password-input"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                inputRef={ref}
                returnKeyLabel="sign up"
                returnKeyType="go"
                onSubmitEditing={onSubmit}
              />
            )}
          />
          <Text color="red">
            {errors.password?.message}
            {validationErrors?.password?.[0]}
          </Text>
        </Stack>
        <Button iconAfter={isSubmitting ? <Spinner /> : undefined} onPress={onSubmit} mt="$4">
          Sign Up
        </Button>
        <Text>
          <Text>By signing up, you agree to our </Text>
          <Text onPress={() => Linking.openURL("https://ridebeep.app/privacy")}>
            Privacy Policy
          </Text>
          <Text> and </Text>
          <Text onPress={() => Linking.openURL("https://ridebeep.app/terms")}>
            Terms of Service
          </Text>
        </Text>
      </Stack>
    </Container>
  );
}
