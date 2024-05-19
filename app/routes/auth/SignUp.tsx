import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Linking from "expo-linking";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, View } from "react-native";
import { getPushToken } from "../../utils/notifications";
import { ApolloError, useMutation } from "@apollo/client";
import { isMobile, isSimulator } from "../../utils/constants";
import { generateRNFile } from "../settings/EditProfile";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "@/components/Avatar";
import { VariablesOf, graphql } from "../../graphql";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import { PasswordInput } from "@/components/PasswordInput";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { trpc } from "@/utils/trpc";

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

type Values = VariablesOf<typeof SignUp>["input"];

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

  const utils = trpc.useUtils();

  const [photo, setPhoto] = useState<any>();

  const onSubmit = handleSubmit(async (variables) => {
    try {
      const pushToken = isMobile && !isSimulator ? await getPushToken() : null;

      const { data } = await signup({
        variables: { input: { ...variables, picture, pushToken } },
      });

      await AsyncStorage.setItem("auth", JSON.stringify(data?.signup));

      utils.user.setData(undefined, data!.signup.user as any);
    } catch (error) {
      if (!isValidationError(error as ApolloError)) {
        alert(error as ApolloError);
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
    <KeyboardAwareScrollView contentContainerClassName="flex p-4 bg-white dark:bg-black">
      <View className="flex flex-row items-center gap-4">
        <View className="flex-grow">
          <Label htmlFor="first">First Name</Label>
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
                className="mb-1"
              />
            )}
          />
          <Text color="error">
            {errors.first?.message}
            {validationErrors?.first?.[0]}
          </Text>
          <Label htmlFor="last">Last Name</Label>
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
                className="mb-1"
              />
            )}
          />
          <Text color="error">
            {errors.last?.message}
            {validationErrors?.last?.[0]}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={chooseProfilePhoto}
            aria-label="profile photo"
          >
            <Avatar src={photo?.uri} size="xl" />
          </TouchableOpacity>
          <Text color="error">{validationErrors?.picture?.[0]}</Text>
        </View>
      </View>
      <Label htmlFor="email">Email</Label>
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
            className="mb-1"
          />
        )}
      />
      <Text size="sm" className="mb-1">
        You must a .edu email address
      </Text>
      <Text color="error">
        {errors.email?.message}
        {validationErrors?.email?.[0]}
      </Text>
      <Label htmlFor="phone">Phone</Label>
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
            className="mb-1"
          />
        )}
      />
      <Text color="error">
        {errors.phone?.message}
        {validationErrors?.phone?.[0]}
      </Text>
      <Label htmlFor="venmo">Venmo Username</Label>
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
            className="mb-1"
          />
        )}
      />
      <Text color="error">
        {errors.venmo?.message}
        {validationErrors?.venmo?.[0]}
      </Text>
      <Label htmlFor="username-input">Username</Label>
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
            className="mb-1"
          />
        )}
      />
      <Text color="error">
        {errors.username?.message}
        {validationErrors?.username?.[0]}
      </Text>
      <Label htmlFor="password-input">Password</Label>
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
      <Text color="error">
        {errors.password?.message}
        {validationErrors?.password?.[0]}
      </Text>
      <Button isLoading={isSubmitting} onPress={onSubmit} className="my-4">
        Sign Up
      </Button>
      {/* <Text>
        <Text>By signing up, you agree to our </Text>
        <Text onPress={() => Linking.openURL("https://ridebeep.app/privacy")}>
          Privacy Policy
        </Text>
        <Text> and </Text>
        <Text onPress={() => Linking.openURL("https://ridebeep.app/terms")}>
          Terms of Service
        </Text>
      </Text> */}
    </KeyboardAwareScrollView>
  );
}
