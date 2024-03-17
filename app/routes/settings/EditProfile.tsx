import React, { useMemo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as mime from "react-native-mime-types";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "../../components/Avatar";
import { Alert, Pressable } from "react-native";
import { isMobile } from "../../utils/constants";
import { Container } from "../../components/Container";
import { useUser } from "../../utils/useUser";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { LOCATION_TRACKING } from "../beep/StartBeeping";
import { client } from "../../utils/Apollo";
import { ApolloError, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import { VariablesOf, graphql } from "gql.tada";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  Spinner,
  Input,
  Button,
  Stack,
  XStack,
  Text,
  Label,
  Menu
} from "@beep/ui";
import { MoreVertical } from "@tamagui/lucide-icons";

const DeleteAccount = graphql(`
  mutation DeleteAccount {
    deleteAccount
  }
`);

export const EditAccount = graphql(`
  mutation EditAccount($input: EditUserInput!) {
    editUser(data: $input) {
      id
      name
      first
      last
      email
      phone
      venmo
      cashapp
    }
  }
`);

export const UploadPhoto = graphql(`
  mutation AddProfilePicture($picture: File!) {
    addProfilePicture(picture: $picture) {
      id
      photo
    }
  }
`);

export function generateRNFile(uri: string, name: string) {
  return uri
    ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || "image",
        name,
      })
    : null;
}

type Values = VariablesOf<typeof EditAccount>['input']

export function EditProfileScreen() {
  const { user } = useUser();
  const navigation = useNavigation();

  const defaultValues = useMemo(
    () => ({
      first: user?.first,
      last: user?.last,
      email: user?.email ? user.email : undefined,
      phone: user?.phone ? user.phone : undefined,
      venmo: user?.venmo,
      cashapp: user?.cashapp,
    }),
    [user]
  );

  const [edit, { loading, error }] = useMutation(EditAccount);
  const [deleteAccount] = useMutation(DeleteAccount);

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isDirty },
  } = useForm<Values>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const validationErrors = useValidationErrors<Values>(error);

  const [upload, { loading: uploadLoading }] = useMutation(UploadPhoto, {
      context: {
        headers: {
          "apollo-require-preflight": true,
        },
      },
    });

  const [photo, setPhoto] = useState<any>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          Trigger={
            <Button mr="$2" hitSlop={20} unstyled icon={<MoreVertical size="$1.5" />} />
          }
          items={[
            { title: "Change Password", onPress: () => navigation.navigate("Change Password") },
            { title: "Delete Account", onPress: handleDeleteWrapper },
          ]}
        />
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
        { cancelable: true }
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

        client.resetStore();
      })
      .catch((error: ApolloError) => alert(error.message));
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

    try {
      await upload({ variables: { picture } });
    } catch (error) {
      alert((error as ApolloError)?.message);
    }

    setPhoto(undefined);
  };

  const onSubmit = handleSubmit(async (variables) => {
    try {
      await edit({ variables: { input: variables } });
    } catch (error) {
      if (!isValidationError(error as ApolloError)) {
        alert((error as ApolloError)?.message);
      }
    }
  });

  return (
    <Container
      keyboard
      alignItems="center"
      scrollViewProps={{ bounces: false, scrollEnabled: true }}
      px="$4"
    >
      <Stack w="100%">
        <XStack alignItems="center" gap="$4">
          <Stack gap="$2" flexGrow={1}>
            <Label htmlFor="first" fontWeight="bold">First Name</Label>
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
            <Text color="red">
              {errors.first?.message}
              {validationErrors?.first?.[0]}
            </Text>
            <Label htmlFor="last" fontWeight="bold">Last Name</Label>
            <Controller
              name="last"
              rules={{ required: "Last name is required" }}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  id="last"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value ? value : undefined}
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
          </Stack>
          <Pressable onPress={() => handleUpdatePhoto()}>
            <Avatar url={photo?.uri ?? user?.photo} size="$10" />
            {uploadLoading ? <Spinner /> : null}
          </Pressable>
        </XStack>
        <Label htmlFor="email" fontWeight="bold">Email</Label>
        <Controller
          name="email"
          rules={{ required: "Email is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="email"
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value ? value : undefined}
              ref={ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("phone")}
              textContentType="emailAddress"
            />
          )}
        />
        <Text color="red">
          {errors.email?.message}
          {validationErrors?.email?.[0]}
        </Text>
        <Label htmlFor="bold" fontWeight="bold">Phone Number</Label>
        <Controller
          name="phone"
          rules={{ required: "Phone number is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="phone"
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value ? value : undefined}
              ref={ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("phone")}
              textContentType="telephoneNumber"
            />
          )}
        />
        <Text color="red">
          {errors.phone?.message}
          {validationErrors?.phone?.[0]}
        </Text>
        <Label htmlFor="venmo" fontWeight="bold">Venmo Username</Label>
        <Controller
          name="venmo"
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
              onSubmitEditing={() => setFocus("cashapp")}
              autoCapitalize="none"
            />
          )}
        />
        <Text color="red">
          {errors.venmo?.message}
          {validationErrors?.venmo?.[0]}
        </Text>
        <Label htmlFor="cashapp" fontWeight="bold">Cash App Username</Label>
        <Controller
          name="cashapp"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="cashapp"
              flexGrow={1}
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value as string | undefined}
              ref={ref}
              returnKeyLabel="update"
              returnKeyType="go"
              textContentType="username"
              onSubmitEditing={isDirty ? onSubmit : undefined}
              autoCapitalize="none"
            />
          )}
        />
        <Text color="red">
          {errors.cashapp?.message}
          {validationErrors?.cashapp?.[0]}
        </Text>
        <Button
          onPress={onSubmit}
          iconAfter={loading ? <Spinner /> : undefined}
          disabled={!isDirty}
          mt="$4"
        >
          Update Profile
        </Button>
      </Stack>
    </Container>
  );
}
