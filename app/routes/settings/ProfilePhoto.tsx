import React, { Component } from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { Text, Layout, Button, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { UserContext } from '../../utils/UserContext';
import { config } from "../../utils/config";
import { LoadingIndicator } from "../../utils/Icons";
import { BackIcon } from '../../utils/Icons';
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    navigation: any;
}

interface State {
    isLoading: boolean;
    photo: any;
}

export class ProfilePhotoScreen extends Component<Props, State> {
    static contextType = UserContext;
    
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            photo: null
        };
    }

   async handleUpdate() {
       //send button into loading state
       this.setState({ isLoading: true });

       let form = new FormData();

       let result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images,
           allowsMultipleSelection: false,
           allowsEditing: true,
           aspect: [4, 3],
           base64: false
       });

       if (result.cancelled) {
           this.setState({ isLoading: false });
           return;
       }

       if (Platform.OS !== "ios" && Platform.OS !== "android") {
           console.log("Running as if this is a web device");
           await fetch(result.uri)
               .then(res => res.blob())
               .then(blob => {
                   const fileType = blob.type.split("/")[1];
                   const file = new File([blob], "photo." + fileType);
                   form.append('photo', file)
               });
       }
       else {
           console.log("Runing as mobile device");
           console.log(result);
           const fileType = result.uri.substr(result.uri.lastIndexOf("."), result.uri.length);
           console.log(fileType);
           this.setState({photo: result.uri});

           const photo = {
               uri: result.uri,
               type: 'image/jpeg',
               name: 'photo' + fileType,
           };

           if (!result.cancelled) {
               //@ts-ignore
               form.append("photo", photo);
           }
           else {
               this.setState({ isLoading: false });
           }
       }

       fetch(config.apiUrl + "/files/upload", {
           method: "POST",
           headers: {
               "Authorization": "Bearer " + this.context.user.tokens.token
           },
           body: form
       })
       .then(response => {
           response.json().then(data => {
               if (data.status === "success") {
                   //make a copy of the current user
                   let tempUser = this.context.user;

                   //update the tempUser with the new data
                   tempUser.user.photoUrl = data.url;

                   //update the context
                   this.context.setUser(tempUser);

                   //put the tempUser back into storage
                   AsyncStorage.setItem('auth', JSON.stringify(tempUser));

                   //on success, go back to settings page
                   this.props.navigation.goBack();
               }
               else {
                   this.setState({ isLoading: false });
               }
           });
       })
       .catch((error) => this.setState({ isLoading: false }));
    }

    render () {
        const BackAction = () => (
            <TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
        );
        return (
            <>
                <TopNavigation title='Profile Photo' alignment='center' accessoryLeft={BackAction}/>
                <Layout style={styles.container}>
                    <Text>Upload Profile Photo</Text>
                    {this.state.photo && <Image source={{ uri: this.state.photo }} style={{ width: 200, height: 200, borderRadius: 200/ 2, marginTop: 10, marginBottom: 10 }} />}
                    {!this.state.isLoading ?
                    <Button onPress={() => this.handleUpdate()}>
                        Choose Photo
                    </Button>
                    :
                    <LoadingIndicator />
                    }
                </Layout>
            </>
        );
    }
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
