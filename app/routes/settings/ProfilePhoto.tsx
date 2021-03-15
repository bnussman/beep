import React, { useContext, useState } from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { Text, Layout, Button, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { LoadingIndicator } from "../../utils/Icons";
import { BackIcon } from '../../utils/Icons';
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {gql, useMutation} from '@apollo/client';
import {AddProfilePictureMutation} from '../../generated/graphql';
import {UserContext} from '../../utils/UserContext';
import {isMobile} from '../../utils/config';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';

interface Props {
    navigation: any;
}

const UploadPhoto = gql`
    mutation AddProfilePicture ($picture: Upload!){
        addProfilePicture (picture: $picture) {
            photoUrl
        }
    }
`;

function generateRNFile(uri: string, name: string) {
    return uri ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || 'image',
        name,
    }) : null;
}

export function ProfilePhotoScreen(props: Props) {
    const [upload, { data, loading: uploadLoading , error }] = useMutation<AddProfilePictureMutation>(UploadPhoto);
    const [loading, setLoading] = useState<boolean>(false);
    const [photo, setPhoto] = useState<any>();

    const userContext = useContext(UserContext);

    async function handleUpdate(): Promise<void> {
       setLoading(true);

       const result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images,
           allowsMultipleSelection: false,
           allowsEditing: true,
           aspect: [4, 3],
           base64: false
       });

       if (result.cancelled) {
           setLoading(false);
           return;
       }

       let real;

       if (!isMobile) {
           console.log("Running as if this is a web device");
           const res = await fetch(result.uri);
           const blob = await res.blob();
           const fileType = blob.type.split("/")[1];
           const file = new File([blob], "photo." + fileType);
           console.log(file);
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
               setLoading(false);
           }
       }

       console.log(real);

       const data = await upload({ variables: {
           picture: real
       }});

       if (data.data?.addProfilePicture.photoUrl && userContext?.user) {
           //make a copy of the current user
           const tempAuth = userContext.user;

           //update the tempUser with the new data
           tempAuth.user.photoUrl = data.data?.addProfilePicture.photoUrl;

           //update the context
           userContext.setUser(tempAuth);

           //put the tempUser back into storage
           AsyncStorage.setItem('auth', JSON.stringify(tempAuth));

           //on success, go back to settings page
           props.navigation.goBack();
       }
       else {
           setLoading(false);
       }

    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()}/>
    );
    return (
        <>
            <TopNavigation title='Profile Photo' alignment='center' accessoryLeft={BackAction}/>
            <Layout style={styles.container}>
                <Text>Upload Profile Photo</Text>
                {photo && <Image source={{ uri: photo.uri }} style={{ width: 200, height: 200, borderRadius: 200/ 2, marginTop: 10, marginBottom: 10 }} />}
                {!loading ?
                    <Button onPress={() => handleUpdate()}>
                        Choose Photo
                    </Button>
                    :
                    <LoadingIndicator />
                }
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
    }
});
