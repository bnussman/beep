import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, View } from "react-native";
import { getPushToken } from "../../utils/notifications";
import { isMobile, isSimulator } from "../../utils/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "@/components/Avatar";
import { PasswordInput } from "@/components/PasswordInput";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { getFile } from "@/utils/files";
import { TextField, FieldError, Description } from "heroui-native";

interface Values {
  first: string;
  last: string;
  username: string;
  password: string;
  email: string;
  venmo: string;
  phone: string;
  photo: ImagePicker.ImagePickerAsset;
}

export default function SignUpScreen() {
  const trpc = useTRPC();
  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>();

  const { mutate: signup } = useMutation(
    trpc.auth.signup.mutationOptions({
      async onSuccess(data, variables, result, context) {
        await AsyncStorage.setItem("auth", JSON.stringify(data));

        context.client.setQueryData(trpc.user.me.queryKey(), data.user);
      },
      onError(error) {
        if (error.data?.fieldErrors) {
          for (const key in error.data.fieldErrors) {
            setError(key as keyof Values, {
              message: error.data.fieldErrors[key]?.[0],
            });
          }
        } else {
          alert(error.message);
        }
      },
    }),
  );

  const onSubmit = handleSubmit(async (variables) => {
    const formData = new FormData();

    for (const key in variables) {
      if (key === "photo") {
        formData.append(
          "photo",
          (await getFile(variables[key as "photo"])) as Blob,
        );
      } else {
        formData.append(
          key,
          variables[key as keyof typeof variables] as string,
        );
      }
    }

    if (isMobile && !isSimulator) {
      const pushToken = await getPushToken();
      if (pushToken) {
        formData.append("pushToken", pushToken);
      }
    }

    signup(formData);
  });

  const chooseProfilePhoto = async () => {
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

    setValue("photo", result.assets[0], { shouldValidate: true });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ padding: 16, gap: 8 }}
      bottomOffset={64}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View style={{ flexGrow: 1, gap: 8 }}>
          <Controller
            name="first"
            rules={{ required: "First name is required" }}
            defaultValue=""
            control={control}
            render={({ field, fieldState }) => (
              <TextField isInvalid={!!fieldState.error}>
                <Label htmlFor="first">First Name</Label>
                <Input
                  id="first"
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                  ref={field.ref}
                  returnKeyLabel="next"
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus("last")}
                  textContentType="givenName"
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />
          <Controller
            name="last"
            rules={{ required: "Last name is required" }}
            defaultValue=""
            control={control}
            render={({ field, fieldState }) => (
              <TextField isInvalid={!!fieldState.error}>
                <Label htmlFor="last">Last Name</Label>
                <Input
                  id="last"
                  onBlur={field.onBlur}
                  textContentType="familyName"
                  onChangeText={field.onChange}
                  value={field.value}
                  ref={field.ref}
                  returnKeyLabel="next"
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus("email")}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />
        </View>
        <Controller
          control={control}
          rules={{ required: "Profile picture is required" }}
          name="photo"
          render={({ field, fieldState }) => (
            <TextField isInvalid={!!fieldState.error}>
              <TouchableOpacity
                onPress={chooseProfilePhoto}
                aria-label="profile photo"
              >
                <Avatar src={field.value?.uri} size="xl" />
              </TouchableOpacity>
              <FieldError className="max-w-32 text-center">
                {fieldState.error?.message}
              </FieldError>
            </TextField>
          )}
        />
      </View>
      <Controller
        name="email"
        rules={{ required: "Email is required" }}
        defaultValue=""
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onBlur={field.onBlur}
              textContentType="emailAddress"
              onChangeText={field.onChange}
              value={field.value}
              ref={field.ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("phone")}
              autoCapitalize="none"
            />
            <Description>You must a .edu email address</Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="phone"
        rules={{ required: "Phone number is required" }}
        defaultValue=""
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              onBlur={field.onBlur}
              textContentType="telephoneNumber"
              onChangeText={field.onChange}
              value={field.value}
              ref={field.ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("venmo")}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="venmo"
        rules={{ required: "Venmo username is required" }}
        defaultValue=""
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="venmo">Venmo Username</Label>
            <Input
              id="venmo"
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
              ref={field.ref}
              returnKeyLabel="next"
              returnKeyType="next"
              textContentType="username"
              onSubmitEditing={() => setFocus("username")}
              autoCapitalize="none"
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="username"
        rules={{ required: "Username is required" }}
        defaultValue=""
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="username-input">Username</Label>
            <Input
              id="username-input"
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
              ref={field.ref}
              returnKeyLabel="next"
              returnKeyType="next"
              autoCapitalize="none"
              textContentType="username"
              onSubmitEditing={() => setFocus("password")}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        name="password"
        defaultValue=""
        rules={{ required: "Password is required" }}
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="password-input">Password</Label>
            <PasswordInput
              id="password-input"
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
              ref={field.ref}
              returnKeyLabel="sign up"
              returnKeyType="go"
              onSubmitEditing={onSubmit}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Button isLoading={isSubmitting} onPress={onSubmit}>
        Sign Up
      </Button>
    </KeyboardAwareScrollView>
  );
}
