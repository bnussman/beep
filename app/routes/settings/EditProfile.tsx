import React, { useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { queryClient, useTRPC } from "@/utils/trpc";
import { LOCATION_TRACKING } from "@/utils/location";
import { useMutation } from "@tanstack/react-query";
import { getFile } from "@/utils/files";

export function EditProfileScreen() {
  const trpc = useTRPC();
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
  
  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({ defaultValues: values, values });

  const { mutateAsync: edit } = useMutation(trpc.user.edit.mutationOptions({
    onError(error) {
      if (error.data?.fieldErrors) {
        for (const key in error.data.fieldErrors) {
          setError(key as keyof typeof errors, { message: error.data.fieldErrors[key][0] });
        }
      } else {
        alert(error.message);
      }
    }
  }));

  const { mutate: deleteAccount }  = useMutation(trpc.user.deleteMyAccount.mutationOptions({
    onSuccess() {
      AsyncStorage.clear();

      if (!__DEV__) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }

      queryClient.resetQueries();
    },
    onError(error) {
      alert(error.message);
    }
  }));

  const { mutate: upload, isPending: uploadLoading } = useMutation(trpc.user.updatePicture.mutationOptions({
    onSuccess() {
      setPhoto(undefined);
    },
    onError(error) {
      alert(error.message);
      setPhoto(undefined);
    },
  }));

  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Text size="3xl" style={{ marginRight: 8 }}>
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
          { text: "Delete", onPress: () => deleteAccount(), style: "destructive" },
        ],
        { cancelable: true },
      );
    } else {
      deleteAccount();
    }
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

    setPhoto(result.assets[0]);

    const formData = new FormData();

    formData.append('photo', await getFile(result.assets[0]) as Blob);

    upload(formData);
  };

  const onSubmit = handleSubmit(async (variables) => {
    await edit(variables).catch();
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <View style={{ flexGrow: 1, gap: 8 }}>
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
          <Text color="error">
            {errors.last?.message}
          </Text>
        </View>
        <Pressable onPress={() => handleUpdatePhoto()}>
          <Avatar size="xl" src={photo?.uri ?? user?.photo ?? undefined} />
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
      </Text>
      <Button
        onPress={onSubmit}
        isLoading={isSubmitting}
        disabled={!isDirty}
      >
        Update Profile
      </Button>
    </KeyboardAwareScrollView>
  );
}
