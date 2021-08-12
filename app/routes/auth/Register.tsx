import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Layout, Button, Input, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { BackIcon, SignUpIcon, LoadingIndicator } from "../../utils/Icons";
import { getPushToken } from "../../utils/Notifications";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import { gql, useMutation } from '@apollo/client';
import { SignUpMutation } from '../../generated/graphql';
import { isMobile } from '../../utils/config';
import { generateRNFile } from '../settings/EditProfile';
import { client } from '../../utils/Apollo';
import { GetUserData } from '../../utils/UserQueries';
import { Navigation } from '../../utils/Navigation';
import ProfilePicture from '../../components/ProfilePicture';

interface Props {
    navigation: Navigation;
}

let real: any;

const SignUp = gql`
mutation SignUp ($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String, $username: String!, $password: String!, $picture: Upload!, $pushToken: String) {
        signup(input: {
            first: $first,
            last: $last,
            email: $email,
            phone: $phone,
            venmo: $venmo,
            cashapp: $cashapp,
            username: $username,
            password: $password,
            picture: $picture,
            pushToken: $pushToken
        }) {
            tokens {
                id
                tokenid
            }
        }
    }
`;

function RegisterScreen(props: Props) {
    const [first, setFirst] = useState<string>();
    const [last, setLast] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [venmo, setVenmo] = useState<string>();
    const [cashapp, setCashapp] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [photo, setPhoto] = useState<any>();

    const lastRef = useRef<any>();
    const emailRef = useRef<any>();
    const phoneRef = useRef<any>();
    const venmoRef = useRef<any>();
    const cashappRef = useRef<any>();
    const usernameRef = useRef<any>();
    const passwordRef = useRef<any>();

    const [signup, { loading }] = useMutation<SignUpMutation>(SignUp);

    async function handleSignUp() {
        if (!real) {
            alert("Please choose a profile photo!");
            return;
        }

        try {
            const result = await signup({
                variables: {
                    first: first,
                    last: last,
                    email: email,
                    phone: phone,
                    venmo: venmo,
                    cashapp: cashapp,
                    username: username, 
                    password: password,
                    picture: real,
                    pushToken: isMobile ? await getPushToken() : undefined
                }
            });

            if (result) {
                AsyncStorage.setItem("auth", JSON.stringify(result.data?.signup));

                await client.resetStore();

                const data = await client.query({ query: GetUserData });

                client.writeQuery({
                    query: GetUserData,
                    data
                });

                props.navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'Main' },
                    ],
                });
            }
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
    }

    async function handlePhoto() {
       const result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images,
           allowsMultipleSelection: false,
           allowsEditing: true,
           aspect: [4, 3],
           base64: false
       });

       if (result.cancelled) {
           return;
       }

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
       }
    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()}/>
    );

    return (
        <>
            <TopNavigation title='Sign Up' alignment='center' accessoryLeft={BackAction}/>
            <Layout style={{flex: 1}}>
                <KeyboardAwareScrollView scrollEnabled={false} extraScrollHeight={90}>
                    <Layout style={styles.container}>
                        <Layout style={styles.form}>
                            <Layout style={styles.nameGroup}>
                                <Layout style={{ width: '70%' }}>
                                    <Input
                                        label="First Name"
                                        textContentType="givenName"
                                        placeholder="Banks"
                                        returnKeyType="next"
                                        onChangeText={(text) => setFirst(text)}
                                        onSubmitEditing={() => lastRef.current.focus()}
                                    />
                                    <Input
                                        ref={lastRef}
                                        label="Last Name"
                                        textContentType="familyName"
                                        placeholder="Nussman"
                                        returnKeyType="next"
                                        onChangeText={(text) => setLast(text)}
                                        onSubmitEditing={() => emailRef.current.focus()}
                                    />
                                </Layout>
                                <TouchableOpacity style={{ marginLeft: 4 }} onPress={() => handlePhoto()}>
                                    <ProfilePicture url={photo?.uri} size={90} />
                                </TouchableOpacity>
                        </Layout>
                        <Input
                            ref={emailRef}
                            label="Email"
                            textContentType="emailAddress"
                            placeholder="example@ridebeep.app"
                            caption="Use your .edu email to be verified as a student"
                            returnKeyType="next"
                            onChangeText={(text) => setEmail(text)}
                            onSubmitEditing={() => phoneRef.current.focus()}
                        />
                        <Input
                            ref={phoneRef}
                            label="Phone Number"
                            textContentType="telephoneNumber"
                            placeholder="7044043044"
                            returnKeyType="next"
                            style={{marginTop: 5}}
                            onChangeText={(text) => setPhone(text)}
                            onSubmitEditing={() => venmoRef.current.focus()}
                        />
                        <Input
                            ref={venmoRef}
                            label="Venmo Username (optional)"
                            textContentType="username"
                            placeholder="banks"
                            returnKeyType="next"
                            onChangeText={(text) => setVenmo(text)}
                            onSubmitEditing={() => cashappRef.current.focus()}
                        />
                        <Input
                            ref={cashappRef}
                            label="Cash App Username (optional)"
                            textContentType="username"
                            placeholder="banks"
                            returnKeyType="next"
                            onChangeText={(text) => setCashapp(text)}
                            onSubmitEditing={() => usernameRef.current.focus()}
                        />
                        <Input
                            ref={usernameRef}
                            label="Username"
                            textContentType="username"
                            placeholder="banksnussman"
                            returnKeyType="next"
                            onChangeText={(text) => setUsername(text)}
                            onSubmitEditing={() => passwordRef.current.focus()}
                        />
                        <Input
                            ref={passwordRef}
                            label="Password"
                            textContentType="password"
                            placeholder="Password"
                            returnKeyType="go"
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                            onSubmitEditing={() => handleSignUp()}
                        />
                        {!loading ? 
                            <Button
                                onPress={() => handleSignUp()}
                                accessoryRight={SignUpIcon}
                            >
                            Sign Up
                            </Button>
                            :
                            <Button appearance='outline' accessoryRight={LoadingIndicator}>
                                Loading
                            </Button>
                        }
                        <Layout style={{marginTop: 10, alignItems: "center"}}>
                            <Text appearance="hint">By signing up, you agree to our </Text>
                            <Layout style={{flex: 1, flexDirection: 'row'}}>
                                <Text onPress={() => Linking.openURL('https://ridebeep.app/privacy')}>Privacy Policy</Text>
                                <Text appearance="hint"> and </Text>
                                <Text onPress={() => Linking.openURL('https://ridebeep.app/terms')}>Terms of Service</Text>
                            </Layout>
                        </Layout>
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
    nameGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
    },
    form: {
        justifyContent: "center",
        width: "83%",
        marginTop: 20,
    }
});

export default RegisterScreen;
