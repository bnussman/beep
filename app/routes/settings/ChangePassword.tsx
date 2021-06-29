import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Layout, Button, Input, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { EditIcon, LoadingIndicator, BackIcon } from "../../utils/Icons";
import { gql, useMutation } from '@apollo/client';
import { ChangePasswordMutation } from '../../generated/graphql';

interface Props {
    navigation: any;
}

const ChangePassword = gql`
    mutation ChangePassword($password: String!) {
        changePassword (input: {password: $password})
    }
  `;

export function ChangePasswordScreen(props: Props) {
    
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [changePassword, { data, loading, error }] = useMutation<ChangePasswordMutation>(ChangePassword);
    const confirmPasswordRef = useRef<any>();

    async function handleChangePassword() {
        if (password !== confirmPassword) {
            return alert("Your passwords do not match");
        }
       
        try {
            const result = await changePassword({
                variables: {
                    password: password
                }
            });
            props.navigation.goBack();
        }
        catch (error) {
            alert(error);
        }
    }

        const BackAction = () => (
            <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()}/>
        );

        return (
            <>
                <TopNavigation title='Change Password' alignment='center' accessoryLeft={BackAction}/>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!(Platform.OS == "ios" || Platform.OS == "android")} >
                <Layout style={styles.container}>
                    <Layout style={styles.form}>
                        <Input
                            secureTextEntry={true}
                            label="New Password"
                            textContentType="password"
                            placeholder="New Password"
                            onChangeText={(text) => setPassword(text)}
                            onSubmitEditing={() => confirmPasswordRef.current.focus()}
                            returnKeyType='next'
                         />
                        <Input
                            ref={confirmPasswordRef}
                            secureTextEntry={true}
                            label="Repeat New Password"
                            textContentType="password"
                            placeholder="New Password"
                            returnKeyType="go"
                            onChangeText={(text) => setConfirmPassword(text)}
                            onSubmitEditing={() => handleChangePassword()} />
                        {!loading ? 
                            <Button
                                onPress={() => handleChangePassword()}
                                accessoryRight={EditIcon}
                                style={styles.button}
                            >
                                Change Password
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
                </TouchableWithoutFeedback>
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
    }
});
