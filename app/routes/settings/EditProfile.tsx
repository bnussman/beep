import React, { useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { useUser } from "@/utils/useUser";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { getFile } from "@/utils/files";

export function EditProfileScreen() {
  const trpc = useTRPC();
  const { user } = useUser();

  const values = useMemo(
    () => ({
      first: user?.first,
      last: user?.last,
      email: user?.email,
      phone: user?.phone,
      venmo: user?.venmo,
      cashapp: user?.cashapp,
    }),
    [user],
  );

  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({ defaultValues: values, values });

  const { mutateAsync: edit } = useMutation(
    trpc.user.edit.mutationOptions({
      onError(error) {
        if (error.data?.fieldErrors) {
          for (const key in error.data.fieldErrors) {
            setError(key as keyof typeof errors, {
              message: error.data.fieldErrors[key][0],
            });
          }
        } else {
          alert(error.message);
        }
      },
    }),
  );

  const { mutate: upload, isPending: uploadLoading } = useMutation(
    trpc.user.updatePicture.mutationOptions({
      onSuccess() {
        setPhoto(undefined);
      },
      onError(error) {
        alert(error.message);
        setPhoto(undefined);
      },
    }),
  );

  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>();

  const handleUpdatePhoto = async () => {
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

    setPhoto(result.assets[0]);

    const formData = new FormData();

    formData.append("photo", (await getFile(result.assets[0])) as Blob);

    upload(formData);
  };

  const onSubmit = handleSubmit(async (variables) => {
    await edit(variables).catch();
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <View style={{ flexGrow: 1, gap: 8 }}>
          <View style={{ gap: 4 }}>
            <Label htmlFor="first">First Name</Label>
            <Controller
              name="first"
              rules={{ required: "First name is required" }}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  id="first"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value ? value : undefined}
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
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  id="last"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value ?? ""}
                  ref={ref}
                  returnKeyLabel="next"
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus("email")}
                  textContentType="familyName"
                />
              )}
            />
            <Text color="error">{errors.last?.message}</Text>
          </View>
        </View>
        <Pressable onPress={() => handleUpdatePhoto()}>
          <Avatar size="xl" src={photo?.uri ?? user?.photo ?? undefined} />
          {uploadLoading ? <ActivityIndicator /> : null}
        </Pressable>
      </View>

      <View style={{ gap: 4 }}>
        <Label htmlFor="email">Email</Label>
        <Controller
          name="email"
          rules={{ required: "Email is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="email"
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value ?? ""}
              ref={ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("phone")}
              textContentType="emailAddress"
            />
          )}
        />
        <Text color="error">{errors.email?.message}</Text>
      </View>

      <View style={{ gap: 4 }}>
        <Label htmlFor="bold">Phone Number</Label>
        <Controller
          name="phone"
          rules={{ required: "Phone number is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="phone"
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value ?? ""}
              ref={ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("phone")}
              textContentType="telephoneNumber"
            />
          )}
        />
        <Text color="error">{errors.phone?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Label htmlFor="venmo">Venmo Username</Label>
        <Controller
          name="venmo"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value ?? ""}
              ref={ref}
              returnKeyLabel="next"
              returnKeyType="next"
              textContentType="username"
              onSubmitEditing={() => setFocus("cashapp")}
              autoCapitalize="none"
            />
          )}
        />
        <Text color="error">{errors.venmo?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Label htmlFor="cashapp">Cash App Username</Label>
        <Controller
          name="cashapp"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="cashapp"
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value ?? ""}
              ref={ref}
              returnKeyLabel="update"
              returnKeyType="go"
              textContentType="username"
              onSubmitEditing={isDirty ? onSubmit : undefined}
              autoCapitalize="none"
            />
          )}
        />
        <Text color="error">{errors.cashapp?.message}</Text>
      </View>
      <Button onPress={onSubmit} isLoading={isSubmitting} disabled={!isDirty}>
        Update Profile
      </Button>
    </KeyboardAwareScrollView>
  );
}
