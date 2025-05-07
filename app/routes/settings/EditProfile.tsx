import React, { useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as mime from "react-native-mime-types";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as DropdownMenu from "zeego/dropdown-menu";
import { View, Alert, Pressable, ActivityIndicator } from "react-native";
import { isMobile } from "@/utils/constants";
import { Avatar } from "@/components/Avatar";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { useUser } from "@/utils/useUser";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { queryClient, trpc } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";
import { LOCATION_TRACKING } from "@/utils/location";

export class ReactNativeFile {
  uri: string;
  name: string;
  type: string;

  constructor({ uri, name, type }: { uri: string, name: string, type: string }) {
    this.uri = uri;
    this.name = name;
    this.type = type;
  }
}

export function generateRNFile(uri: string, name: string) {
  return new ReactNativeFile({
    uri,
    type: mime.lookup(uri) || "image",
    name,
  });
}

export function EditProfileScreen() {
  const { user } = useUser();
  const navigation = useNavigation();

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

  const { mutateAsync: edit, error } = trpc.user.edit.useMutation();
  const { mutateAsync: deleteAccount }  = trpc.user.deleteMyAccount.useMutation();

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({ defaultValues: values, values });

  const validationErrors = error?.data?.zodError?.fieldErrors;

  const { mutateAsync: upload, isPending: uploadLoading } = trpc.user.updatePicture.useMutation();

  const [photo, setPhoto] = useState<any>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Text size="3xl" className="mr-2">
              🧰
            </Text>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              key="change-password"
              onSelect={() => navigation.navigate("Change Password")}
            >
              <DropdownMenu.ItemTitle>Change Password</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              destructive
              key="delete-account"
              onSelect={handleDeleteWrapper}
            >
              <DropdownMenu.ItemTitle>Delete Account</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ),
    });
  }, [navigation]);

  const handleDeleteWrapper = () => {
    if (isMobile) {
      Alert.alert(
        "Delete Your Account?",
        "Are you sure you want to delete your account? We will delete all of your account data. It will not be kept.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "Delete", onPress: handleDelete, style: "destructive" },
        ],
        { cancelable: true },
      );
    } else {
      handleDelete();
    }
  };

  const handleDelete = () => {
    deleteAccount()
      .then(() => {
        AsyncStorage.clear();

        if (!__DEV__) {
          Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        }

        queryClient.resetQueries();
      })
      .catch((error: TRPCClientError<any>) => alert(error.message));
  };

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

    let picture;

    if (isMobile) {
      setPhoto(result.assets[0]);
      const fileType = result.assets[0].uri.split(".")[1];
      const file = generateRNFile(result.assets[0].uri, `file.${fileType}`);
      picture = file;
    } else {
      const res = await fetch(result.assets[0].uri);
      const blob = await res.blob();
      const fileType = blob.type.split("/")[1];
      const file = new File([blob], "photo." + fileType);
      picture = file;
      setPhoto(result.assets[0]);
    }

    if (!picture) {
      return alert('Error when picking photo');
    }

    const formData = new FormData();

    // @ts-expect-error need to fix
    formData.append('photo', picture);

    try {
      await upload(formData);
    } catch (error) {
      alert((error as TRPCClientError<any>).message);
    }

    setPhoto(undefined);
  };

  const onSubmit = handleSubmit(async (variables) => {
    try {
      await edit(variables);
    } catch (error) {
      alert((error as TRPCClientError<any>).message);
    }
  });

  return (
    <KeyboardAwareScrollView contentContainerClassName="p-4">
      <View className="flex flex-row gap-4 items-center">
        <View className="flex-grow">
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
          <Text color="error">
            {errors.first?.message}
            {validationErrors?.first?.[0]}
          </Text>
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
          <Text>
            {errors.last?.message}
            {validationErrors?.last?.[0]}
          </Text>
        </View>
        <Pressable onPress={() => handleUpdatePhoto()}>
          <Avatar size="xl" src={photo?.uri ?? user?.photo} />
          {uploadLoading ? <ActivityIndicator /> : null}
        </Pressable>
      </View>
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
      <Text color="error">
        {errors.email?.message}
        {validationErrors?.email?.[0]}
      </Text>
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
      <Text color="error">
        {errors.phone?.message}
        {validationErrors?.phone?.[0]}
      </Text>
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
      <Text color="error">
        {errors.venmo?.message}
        {validationErrors?.venmo?.[0]}
      </Text>
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
      <Text color="error">
        {errors.cashapp?.message}
        {validationErrors?.cashapp?.[0]}
      </Text>
      <Button
        onPress={onSubmit}
        isLoading={isSubmitting}
        disabled={!isDirty}
        className="mt-4"
      >
        Update Profile
      </Button>
    </KeyboardAwareScrollView>
  );
}
