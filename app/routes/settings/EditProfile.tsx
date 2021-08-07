import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Layout, Button, Input, TopNavigation, TopNavigationAction, Text } from '@ui-kitten/components';
import { UserContext } from '../../utils/UserContext';
import { EditIcon, LoadingIndicator } from "../../utils/Icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackIcon } from '../../utils/Icons';
import { gql, useMutation } from '@apollo/client';
import { AddProfilePictureMutation, EditAccountMutation, Maybe } from '../../generated/graphql';
import { Navigation } from '../../utils/Navigation';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import * as ImagePicker from 'expo-image-picker';
import ProfilePicture from '../../components/ProfilePicture';
import {isMobile} from '../../utils/config';

interface Props {
  navigation: Navigation;
}

const EditAccount = gql`
mutation EditAccount($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String) {
        editAccount (
            input: {
                first : $first,
                last: $last,
                email: $email,
                phone: $phone,
                venmo: $venmo,
                cashapp: $cashapp
            }
        ) {
        id
        name
        }
    }
`;

export const UploadPhoto = gql`
    mutation AddProfilePicture ($picture: Upload!){
        addProfilePicture (picture: $picture) {
            photoUrl
        }
    }
`;

export function generateRNFile(uri: string, name: string) {
    return uri ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || 'image',
        name,
    }) : null;
}

export function EditProfileScreen(props: Props): JSX.Element {
  const user = useContext(UserContext);
  const [edit, { loading }] = useMutation<EditAccountMutation>(EditAccount);

    const [upload, { data, loading: uploadLoading , error }] = useMutation<AddProfilePictureMutation>(UploadPhoto);
    const [photoLoading, setPhotoLoading] = useState<boolean>(false);
    const [photo, setPhoto] = useState<any>();

  const [username] = useState<string>(user.username);
  const [first, setFirst] = useState<string>(user.first);
  const [last, setLast] = useState<string>(user.last);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [venmo, setVenmo] = useState<Maybe<string> | undefined>(user?.venmo);
  const [cashapp, setCashapp] = useState<Maybe<string> | undefined>(user?.cashapp);

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
           base64: false
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
       }
       else {
           if (!result.cancelled) {
               setPhoto(result);
               const file = generateRNFile(result.uri, "file.jpg");
               real = file;
           }
           else {
               setPhotoLoading(false);
           }
       }

       try {
       await upload({
           variables: {
               picture: real
           }
       });
       }
       catch (error) {
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
          cashapp: cashapp
        }
      });
      alert("Successfully updated profile");
    }
    catch (error) {
      alert(error.message);
    }
  }

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()} />
  );

  return (
      <>
          <TopNavigation title='Edit Profile' alignment='center' accessoryLeft={BackAction} />
          <Layout style={{ flex: 1 }}>
              <KeyboardAwareScrollView scrollEnabled={false} extraScrollHeight={70}>
                  <Layout style={styles.container}>
                      <Layout style={styles.form}>
                          <Layout style={styles.nameGroup}>
                              <Layout style={{ width: '68%' }}>
                                  <Input
                                      label="First Name"
                                      value={first}
                                      textContentType="givenName"
                                      placeholder="First Name"
                                      returnKeyType="next"
                                      onChangeText={(text) => setFirst(text)}
                                      onSubmitEditing={() => lastRef.current.focus()}
                                  />
                                  <Input
                                      label="Last Name"
                                      ref={lastRef}
                                      value={last}
                                      textContentType="familyName"
                                      placeholder="Last Name"
                                      returnKeyType="next"
                                      onChangeText={(text) => setLast(text)}
                                      onSubmitEditing={() => emailRef.current.focus()}
                                  />
                              </Layout>
                              <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => handleUpdatePhoto()}>
                                  <ProfilePicture url={photo?.uri || user.photoUrl} size={100} />
                                  {photoLoading || uploadLoading ? <LoadingIndicator /> : null}
                              </TouchableOpacity>
                          </Layout>
                                  <Input
                                      label="Username"
                                      value={username}
                                      textContentType="username"
                                      placeholder="Username"
                                      disabled={true}
                                  />
              <Input
                label="Email"
                ref={emailRef}
                value={email}
                textContentType="emailAddress"
                placeholder="Email"
                caption={user.isEmailVerified ? (user.isStudent) ? "Your email is verified and you are a student" : "Your email is verified" : "Your email is not verified"}
                returnKeyType="next"
                onChangeText={(text) => setEmail(text)}
                onSubmitEditing={() => phoneRef.current.focus()}
              />
              <Input
                label="Phone Number"
                ref={phoneRef}
                value={phone}
                textContentType="telephoneNumber"
                placeholder="Phone Number"
                returnKeyType="next"
                style={{ marginTop: 5 }}
                onChangeText={(text) => setPhone(text)}
                onSubmitEditing={() => venmoRef.current.focus()}
              />
              <Input
                label="Venmo Username"
                ref={venmoRef}
                value={venmo}
                textContentType="username"
                placeholder="Venmo Username"
                returnKeyType="next"
                onChangeText={(text) => setVenmo(text)}
                onSubmitEditing={() => cashappRef.current.focus()}
              />
              <Input
                label="Cash App Username"
                ref={cashappRef}
                value={cashapp}
                textContentType="username"
                placeholder="Cash App Username"
                returnKeyType="go"
                onChangeText={(text) => setCashapp(text)}
                onSubmitEditing={() => handleUpdate()}
              />
              {!loading ?
                <Button
                  onPress={() => handleUpdate()}
                  accessoryRight={EditIcon}
                  style={styles.button}
                >
                  Update Profile
                </Button>
                :
                <Button
                  appearance="outline"
                  accessoryRight={LoadingIndicator}
                  style={styles.button}
                >
                  Loading
                </Button>
              }
            </Layout>
          </Layout>
        </KeyboardAwareScrollView>
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  form: {
    justifyContent: "center",
    width: "83%",
    marginTop: 20,
  },
  button: {
    marginTop: 8
  },
  nameGroup: {
      flex: 1,
      flexDirection: 'row',
      alignItems: "center",
  },
});
