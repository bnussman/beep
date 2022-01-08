import React, { useContext, useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import { UserContext } from "../../utils/UserContext";
import { gql, useMutation } from "@apollo/client";
import {
  AddProfilePictureMutation,
  EditAccountMutation,
  Maybe,
} from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";
import { ReactNativeFile } from "apollo-upload-client";
import * as mime from "react-native-mime-types";
import * as ImagePicker from "expo-image-picker";
import { isMobile } from "../../utils/config";
import { Container } from "../../components/Container";
import {
  Spinner,
  Input,
  Button,
  Stack,
  Avatar,
  Flex,
  Spacer,
} from "native-base";

interface Props {
  navigation: Navigation;
}

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

export function EditProfileScreen(props: Props): JSX.Element {
  const user = useContext(UserContext);
  const [edit, { loading }] = useMutation<EditAccountMutation>(EditAccount);

  const [upload, { data, loading: uploadLoading, error }] =
    useMutation<AddProfilePictureMutation>(UploadPhoto);
  const [photoLoading, setPhotoLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState<any>();

  const [username] = useState<string>(user.username);
  const [first, setFirst] = useState<string>(user.first);
  const [last, setLast] = useState<string>(user.last);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [venmo, setVenmo] = useState<Maybe<string> | undefined>(user?.venmo);
  const [cashapp, setCashapp] = useState<Maybe<string> | undefined>(
    user?.cashapp
  );

  const lastRef = useRef<any>();
  const emailRef = useRef<any>();
  const phoneRef = useRef<any>();
  const venmoRef = useRef<any>();
  const cashappRef = useRef<any>();

  useEffect(() => {
    if (first !== user.first) setFirst(user.first);
    if (last !== user.last) setLast(user.last);
    if (email !== user.email) setEmail(user.email);
    if (phone !== user.first) setPhone(user.phone);
    if (venmo !== user.venmo) setVenmo(user?.venmo);
    if (cashapp !== user.cashapp) setCashapp(user?.cashapp);
  }, [user]);

  async function handleUpdatePhoto(): Promise<void> {
    setPhotoLoading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });

    if (result.cancelled) {
      setPhotoLoading(false);
      return;
    }

    let real;

    if (!isMobile) {
      const res = await fetch(result.uri);
      const blob = await res.blob();
      const fileType = blob.type.split("/")[1];
      const file = new File([blob], "photo." + fileType);
      real = file;
      setPhoto(result);
    } else {
      console.log(result);
      if (!result.cancelled) {
        setPhoto(result);
        const fileType = result.uri.split(".")[1];
        console.log(fileType);
        const file = generateRNFile(result.uri, `file.${fileType}`);
        real = file;
        console.log(real);
      } else {
        setPhotoLoading(false);
      }
    }

    try {
      await upload({
        variables: {
          picture: real,
        },
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }

    setPhoto(undefined);
    setPhotoLoading(false);
  }

  async function handleUpdate() {
    try {
      await edit({
        variables: {
          first: first,
          last: last,
          email: email,
          phone: phone,
          venmo: venmo,
          cashapp: cashapp,
        },
      });
      alert("Successfully updated profile");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Container alignItems="center">
      <Stack space={4} mt={4} w="90%">
        <Flex direction="row">
          <Stack space={4}>
            <Input
              minW={220}
              value={first}
              textContentType="givenName"
              placeholder="First Name"
              returnKeyType="next"
              onChangeText={(text) => setFirst(text)}
              onSubmitEditing={() => lastRef.current.focus()}
            />
            <Input
              ref={lastRef}
              value={last}
              textContentType="familyName"
              placeholder="Last Name"
              returnKeyType="next"
              onChangeText={(text) => setLast(text)}
              onSubmitEditing={() => emailRef.current.focus()}
            />
          </Stack>
          <Spacer />
          <Pressable onPress={() => handleUpdatePhoto()}>
            <Avatar source={{ uri: photo?.uri || user.photoUrl }} size={100} />
            {photoLoading || uploadLoading ? <Spinner /> : null}
          </Pressable>
        </Flex>
        <Input
          value={username}
          textContentType="username"
          placeholder="Username"
          isDisabled
        />
        <Input
          ref={emailRef}
          value={email}
          textContentType="emailAddress"
          placeholder="Email"
          returnKeyType="next"
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={() => phoneRef.current.focus()}
        />
        <Input
          ref={phoneRef}
          value={phone}
          textContentType="telephoneNumber"
          placeholder="Phone Number"
          returnKeyType="next"
          onChangeText={(text) => setPhone(text)}
          onSubmitEditing={() => venmoRef.current.focus()}
        />
        <Input
          ref={venmoRef}
          value={!venmo ? undefined : venmo}
          textContentType="username"
          placeholder="Venmo Username"
          returnKeyType="next"
          onChangeText={(text) => setVenmo(text)}
          onSubmitEditing={() => cashappRef.current.focus()}
        />
        <Input
          ref={cashappRef}
          value={!cashapp ? undefined : cashapp}
          textContentType="username"
          placeholder="Cash App Username"
          returnKeyType="go"
          onChangeText={(text) => setCashapp(text)}
          onSubmitEditing={() => handleUpdate()}
        />
        <Button onPress={() => handleUpdate()} isLoading={loading}>
          Update Profile
        </Button>
      </Stack>
    </Container>
  );
}
