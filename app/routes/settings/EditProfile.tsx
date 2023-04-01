import React, { useMemo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-expect-error no types :(
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
import { Navigation } from "../../utils/Navigation";
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
  FormControl,
  WarningOutlineIcon,
  InputGroup,
  InputLeftAddon,
  HStack,
  Menu,
  Icon,
} from "native-base";

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
  const navigation = useNavigation<Navigation>();

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
        <Menu
          w="190"
          trigger={(triggerProps) => {
            return (
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}
              >
                <Icon
                  mr={3}
                  size="xl"
                  as={Ionicons}
                  name="ios-ellipsis-horizontal-circle"
                />
              </Pressable>
            );
          }}
        >
          <Menu.Item onPress={() => navigation.push("Change Password")}>
            Change Password
          </Menu.Item>
          <Menu.Item _text={{ color: "red.400" }} onPress={handleDeleteWrapper}>
            Delete Account
          </Menu.Item>
        </Menu>
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
      px={4}
      pt={2}
    >
      <Stack space={2} w="100%">
        <HStack alignItems="center" space={8}>
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
          <Pressable onPress={() => handleUpdatePhoto()}>
            <Avatar url={photo?.uri ?? user?.photo} size="xl" />
            {uploadLoading ? <Spinner /> : null}
          </Pressable>
        </HStack>
        <FormControl
          isInvalid={Boolean(errors.email) || Boolean(validationErrors?.email)}
        >
          <FormControl.Label>Email</FormControl.Label>
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
                size="lg"
              />
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.email?.message}
            {validationErrors?.email?.[0]}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={Boolean(errors.phone) || Boolean(validationErrors?.phone)}
        >
          <FormControl.Label>Phone Number</FormControl.Label>
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
                  onSubmitEditing={() => setFocus("cashapp")}
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
            Boolean(errors.cashapp) || Boolean(validationErrors?.cashapp)
          }
        >
          <FormControl.Label>Cash App Username</FormControl.Label>
          <Controller
            name="cashapp"
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <InputGroup>
                <InputLeftAddon children="$" />
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
                  size="lg"
                />
              </InputGroup>
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.cashapp?.message}
            {validationErrors?.cashapp?.[0]}
          </FormControl.ErrorMessage>
        </FormControl>
        <Button
          onPress={onSubmit}
          isLoading={loading}
          isDisabled={!isDirty}
          mt={2}
        >
          Update Profile
        </Button>
      </Stack>
    </Container>
  );
}
