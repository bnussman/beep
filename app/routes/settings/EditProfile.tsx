import React, { useMemo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as mime from "react-native-mime-types";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "../../components/Avatar";
import { Alert, Pressable } from "react-native";
import { isMobile } from "../../utils/constants";
import { Container } from "../../components/Container";
import { UserData, useUser } from "../../utils/useUser";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LOCATION_TRACKING } from "../beep/StartBeeping";
import { client } from "../../utils/Apollo";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  AddProfilePictureMutation,
  DeleteAccountMutation,
  EditAccountMutation,
  EditUserInput,
} from "../../generated/graphql";
import {
  Spinner,
  Input,
  Button,
  Stack,
  XStack,
  SizableText,
  Label,
  Popover,
  YStack,
} from "tamagui";
import { MoreHorizontal } from "@tamagui/lucide-icons";

const DeleteAccount = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;

export const EditAccount = gql`
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
`;

export const UploadPhoto = gql`
  mutation AddProfilePicture($picture: Upload!) {
    addProfilePicture(picture: $picture) {
      id
      photo
    }
  }
`;

export function generateRNFile(uri: string, name: string) {
  return uri
    ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || "image",
        name,
      })
    : null;
}

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
    [user],
  );

  const [edit, { loading, error }] =
    useMutation<EditAccountMutation>(EditAccount);
  const [deleteAccount] = useMutation<DeleteAccountMutation>(DeleteAccount);

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditUserInput>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const validationErrors = useValidationErrors<EditUserInput>(error);

  const [upload, { loading: uploadLoading }] =
    useMutation<AddProfilePictureMutation>(UploadPhoto, {
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
        <Popover size="$5" allowFlip>
          <Popover.Trigger asChild>
            <Pressable style={{ marginRight: 8 }}>
              <MoreHorizontal />
            </Pressable>
          </Popover.Trigger>

          <Popover.Content
            borderWidth={1}
            borderColor="$borderColor"
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
            elevate
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
          >
            <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

            <YStack space="$3">
              <Popover.Close asChild>
                <Button
                  size="$3"
                  onPress={() => {
                    navigation.navigate("Change Password");
                  }}
                >
                  Change Password
                </Button>
              </Popover.Close>
              <Popover.Close>
                <Button
                  size="$3"
                  onPress={() => {
                    handleDeleteWrapper();
                  }}
                >
                  Delete Account
                </Button>
              </Popover.Close>
            </YStack>
          </Popover.Content>
        </Popover>
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

        client.writeQuery({
          query: UserData,
          data: {
            getUser: null,
          },
        });
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
      p="$4"
    >
      <Stack space={2} w="100%">
        <XStack alignItems="center" space={8}>
          <Stack flexGrow={1} space={2}>
            <Label>First Name</Label>
            <Controller
              name="first"
              rules={{ required: "First name is required" }}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
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
            <SizableText>
              {errors.first?.message}
              {validationErrors?.first?.[0]}
            </SizableText>
            <Label>Last Name</Label>
            <Controller
              name="last"
              rules={{ required: "Last name is required" }}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
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
            <SizableText>
              {errors.last?.message}
              {validationErrors?.last?.[0]}
            </SizableText>
          </Stack>
          <Pressable onPress={() => handleUpdatePhoto()}>
            <Avatar url={photo?.uri ?? user?.photo} size="$10" />
            {uploadLoading ? <Spinner /> : null}
          </Pressable>
        </XStack>
        <Label>Email</Label>
        <Controller
          name="email"
          rules={{ required: "Email is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
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
        <SizableText>
          {errors.email?.message}
          {validationErrors?.email?.[0]}
        </SizableText>
        <Label>Phone Number</Label>
        <Controller
          name="phone"
          rules={{ required: "Phone number is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
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
        <SizableText>
          {errors.phone?.message}
          {validationErrors?.phone?.[0]}
        </SizableText>
        <Label>Venmo Username</Label>
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
        <SizableText>
          {errors.venmo?.message}
          {validationErrors?.venmo?.[0]}
        </SizableText>
        <Label>Cash App Username</Label>
        <Controller
          name="cashapp"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
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
        <SizableText>
          {errors.cashapp?.message}
          {validationErrors?.cashapp?.[0]}
        </SizableText>
        <Button
          onPress={onSubmit}
          iconAfter={loading ? <Spinner /> : undefined}
          disabled={!isDirty}
          mt="$2"
        >
          Update Profile
        </Button>
      </Stack>
    </Container>
  );
}
