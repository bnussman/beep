import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, View } from "react-native";
import { getPushToken } from "../utils/notifications";
import { isMobile, isSimulator } from "../utils/constants";
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
import { useQueryClient } from "@tanstack/react-query";
import { getFile } from "@/utils/files";

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
      async onSuccess(data) {
        await AsyncStorage.setItem("auth", JSON.stringify(data));

        queryClient.setQueryData(trpc.user.me.queryKey(), data.user);
      },
      onError(error) {
        if (error.data?.fieldErrors) {
          for (const key in error.data.fieldErrors) {
            setError(key as keyof Values, { message: error.data.fieldErrors[key]?.[0] });
          }
        } else {
          alert(error.message);
        }
      },
    }),
  );

  const queryClient = useQueryClient();

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
          <View style={{ gap: 4 }}>
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
                />
              )}
            />
            <Text color="error">{errors.first?.message}</Text>
          </View>
          <View style={{ gap: 4 }}>
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
                />
              )}
            />
            <Text color="error">{errors.last?.message}</Text>
          </View>
        </View>
        <View style={{ gap: 4, alignItems: "center" }}>
          <Controller
            control={control}
            rules={{ required: "Profile picture is required" }}
            name="photo"
            render={({ field }) => (
              <TouchableOpacity
                onPress={chooseProfilePhoto}
                aria-label="profile photo"
              >
                <Avatar src={field.value?.uri} size="xl" />
              </TouchableOpacity>
            )}
          />
          <Text color="error" style={{ maxWidth: 100, textAlign: "center" }}>
            {errors.photo?.message}
          </Text>
        </View>
      </View>

      <View style={{ gap: 4 }}>
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
            />
          )}
        />
        <Text size="sm">You must a .edu email address</Text>
        <Text color="error">{errors.email?.message}</Text>
      </View>

      <View style={{ gap: 4 }}>
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
            />
          )}
        />
        <Text color="error">{errors.phone?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
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
            />
          )}
        />
        <Text color="error">{errors.venmo?.message}</Text>
      </View>

      <View style={{ gap: 4 }}>
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
            />
          )}
        />
        <Text color="error">{errors.username?.message}</Text>
      </View>

      <View style={{ gap: 4 }}>
        <Label htmlFor="password-input">Password</Label>
        <Controller
          name="password"
          defaultValue=""
          rules={{ required: "Password is required" }}
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
        <Text color="error">{errors.password?.message}</Text>
      </View>
      <Button isLoading={isSubmitting} onPress={onSubmit}>
        Sign Up
      </Button>
    </KeyboardAwareScrollView>
  );
}
