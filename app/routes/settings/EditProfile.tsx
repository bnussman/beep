import React, { useMemo, useEffect, useState } from "react";
// @ts-expect-error no types :(
import * as mime from "react-native-mime-types";
import * as ImagePicker from "expo-image-picker";
import { Pressable } from "react-native";
import { isMobile } from "../../utils/constants";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { useUser } from "../../utils/useUser";
import { Controller, useForm } from "react-hook-form";
import { isValidationError, useValidationErrors } from "../../utils/useValidationErrors";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import {
  AddProfilePictureMutation,
  EditAccountMutation,
  EditAccountMutationVariables,
} from "../../generated/graphql";
import {
  Spinner,
  Input,
  Button,
  Stack,
  Avatar,
  FormControl,
  WarningOutlineIcon,
  InputGroup,
  InputLeftAddon,
  HStack,
} from "native-base";

const EditAccount = gql`
  mutation EditAccount(
    $first: String!
    $last: String!
    $email: String!
    $phone: String!
    $venmo: String
    $cashapp: String
  ) {
    editAccount(
      input: {
        first: $first
        last: $last
        email: $email
        phone: $phone
        venmo: $venmo
        cashapp: $cashapp
      }
    ) {
      id
      name
    }
  }
`;

export const UploadPhoto = gql`
  mutation AddProfilePicture($picture: Upload!) {
    addProfilePicture(picture: $picture) {
      photoUrl
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

  const defaultValues = useMemo(() => ({
    first: user?.first,
    last: user?.last,
    email: user?.email ? user.email : undefined,
    phone: user?.phone ? user.phone : undefined,
    venmo: user?.venmo,
    cashapp: user?.cashapp
  }), [user]);

  const [edit, { loading, error }] = useMutation<EditAccountMutation>(EditAccount);

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditAccountMutationVariables>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues])

  const validationErrors = useValidationErrors<EditAccountMutationVariables>(error);

  const [upload, { loading: uploadLoading }] =
    useMutation<AddProfilePictureMutation>(UploadPhoto);

  const [photo, setPhoto] = useState<any>();

  async function handleUpdatePhoto(): Promise<void> {
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

    let picture;

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
        const fileType = result.uri.split(".")[1];
        const file = generateRNFile(result.uri, `file.${fileType}`);
        picture = file;
      }
    }

    try {
      await upload({ variables: { picture } });
    } catch (error) {
      Alert(error as ApolloError);
    }

    setPhoto(undefined);
  }

  const onSubmit = handleSubmit(async (variables) => {
    try {
      await edit({ variables });
    } catch (error) {
      if (!isValidationError(error as ApolloError)) {
        Alert(error as ApolloError);
      }
    }
  });

  return (
    <Container
      keyboard
      alignItems="center"
      scrollViewProps={{ bounces: false, scrollEnabled: true }}
    >
      <Stack space={2} mt={4} w="90%">
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
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(val)}
                    value={value}
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
            <Avatar
              key={user?.photoUrl}
              source={{ uri: photo?.uri || user?.photoUrl }}
              size="xl"
            />
            {uploadLoading ? <Spinner /> : null}
          </Pressable>
        </HStack>
        <FormControl
          isInvalid={
            Boolean(errors.email) || Boolean(validationErrors?.email)
          }
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
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("phone")}
                textContentType="emailAddress"
                size="lg"
              />
            )}
          />
          <FormControl.ErrorMessage
            leftIcon={<WarningOutlineIcon size="xs" />}
          >
            {errors.email?.message}
            {validationErrors?.email?.[0]}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={
            Boolean(errors.phone) || Boolean(validationErrors?.phone)
          }
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
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("phone")}
                textContentType="telephoneNumber"
                size="lg"
              />
            )}
          />
          <FormControl.ErrorMessage
            leftIcon={<WarningOutlineIcon size="xs" />}
          >
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
          isInvalid={Boolean(errors.cashapp) || Boolean(validationErrors?.cashapp)}
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
        <Button onPress={onSubmit} isLoading={loading} isDisabled={!isDirty} mt={2}>
          Update Profile
        </Button>
      </Stack>
    </Container>
  );
}
