import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import { getPushToken } from "../../utils/Notifications";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Scalars, SignUpInput, SignUpMutation } from "../../generated/graphql";
import { isMobile } from "../../utils/constants";
import { generateRNFile } from "../settings/EditProfile";
import { client, wsLink } from "../../utils/Apollo";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { UserData } from "../../utils/useUser";
import { Controller, useForm } from "react-hook-form";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  Button,
  Input,
  Text,
  Flex,
  Center,
  FormControl,
  HStack,
  Stack,
  WarningOutlineIcon,
  InputGroup,
  InputLeftAddon,
} from "native-base";
import { Avatar } from "../../components/Avatar";

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

let picture: Scalars["Upload"];

export function SignUpScreen() {
  const [signup, { error }] = useMutation<SignUpMutation>(SignUp);

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
      const pushToken = isMobile ? await getPushToken() : null;

      const { data } = await signup({
        variables: { input: { ...variables, picture, pushToken } },
      });

      await AsyncStorage.setItem("auth", JSON.stringify(data?.signup));

      client.writeQuery({
        query: UserData,
        data: { getUser: { ...data?.signup.user, pushToken } },
      });

      wsLink.client.restart();
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

  return (
    <Container
      keyboard
      alignItems="center"
      scrollViewProps={{ bounces: false, scrollEnabled: true }}
    >
      <Stack space={2} w="90%" mt={4}>
        <HStack space={4} alignItems="center">
          <Stack space={2} flexGrow={1}>
            <FormControl
              isInvalid={
                Boolean(errors.first) || Boolean(validationErrors?.first)
              }
            >
              <FormControl.Label>First Name</FormControl.Label>
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
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.first?.message}
                {validationErrors?.first?.[0]}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                Boolean(errors.last) || Boolean(validationErrors?.last)
              }
            >
              <FormControl.Label>Last Name</FormControl.Label>
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
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.last?.message}
                {validationErrors?.last?.[0]}
              </FormControl.ErrorMessage>
            </FormControl>
          </Stack>
          <FormControl
            w="100px"
            isInvalid={
              Boolean(errors.picture) || Boolean(validationErrors?.picture)
            }
          >
            <TouchableOpacity onPress={chooseProfilePhoto}>
              <Avatar url={photo?.uri} size="xl" />
            </TouchableOpacity>
            <FormControl.ErrorMessage>
              {errors.picture?.message}
              {validationErrors?.picture?.[0]}
            </FormControl.ErrorMessage>
          </FormControl>
        </HStack>
        <FormControl
          isInvalid={Boolean(errors.email) || Boolean(validationErrors?.email)}
        >
          <FormControl.Label>Email</FormControl.Label>
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
          <FormControl.HelperText>
            You must a .edu email address
          </FormControl.HelperText>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.email?.message}
            {validationErrors?.email?.[0]}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors.phone) || Boolean(validationErrors?.phone)}
        >
          <FormControl.Label>Phone</FormControl.Label>
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
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.phone?.message}
            {validationErrors?.phone?.[0]}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors.venmo) || Boolean(validationErrors?.venmo)}
        >
          <FormControl.Label>Venmo Username</FormControl.Label>
          <Controller
            name="venmo"
            rules={{ required: "Venmo username is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <InputGroup>
                <InputLeftAddon children="@" />
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
              </InputGroup>
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.venmo?.message}
            {validationErrors?.venmo?.[0]}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            Boolean(errors.username) || Boolean(validationErrors?.username)
          }
        >
          <FormControl.Label>Username</FormControl.Label>
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
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.username?.message}
            {validationErrors?.username?.[0]}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            Boolean(errors.password) || Boolean(validationErrors?.password)
          }
        >
          <FormControl.Label>Password</FormControl.Label>
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
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.password?.message}
            {validationErrors?.password?.[0]}
          </FormControl.ErrorMessage>
        </FormControl>
        <Button isLoading={isSubmitting} onPress={onSubmit} mt={2}>
          Sign Up
        </Button>
        <Center>
          <Text>By signing up, you agree to our </Text>
          <Flex direction="row" mb={8}>
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
      </Stack>
    </Container>
  );
}
