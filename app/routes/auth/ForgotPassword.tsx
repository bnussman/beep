import React, { Component, ReactNode, useState } from 'react';
import { config } from "../../utils/config";
import { Layout, Button, Input, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { StyleSheet, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { BackIcon, EmailIcon } from "../../utils/Icons";
import { handleFetchError } from "../../utils/Errors";
import { gql, useMutation } from '@apollo/client';
import { ForgotPasswordMutation } from '../../generated/graphql';

interface Props {
    navigation: any;
}

const ForgotPassword = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;

export function ForgotPasswordScreen(props: Props) {
    const [forgot, { data, loading, error }] = useMutation<ForgotPasswordMutation>(ForgotPassword);
    const [email, setEmail] = useState<string>();

    async function handleForgotPassword() {
        const result = await forgot({
            variables: { email: email }
        });
        
        if (result) {
            alert("Check your email for a link to reset your password");
        }
        else {
            alert(error);
        }
    }

        const BackAction = () => (
            <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()}/>
        );

        return (
            <>
                <TopNavigation title='Forgot Password' alignment='center' accessoryLeft={BackAction}/>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!(Platform.OS == "ios" || Platform.OS == "android")} >
                <Layout style={styles.container}>
                    <Layout style={styles.form}>
                        <Input
                            textContentType="emailAddress"
                            placeholder="example@ridebeep.app"
                            returnKeyType="go"
                            onChangeText={(text) => setEmail(text)}
                            onSubmitEditing={() => handleForgotPassword()} />
                    {!loading ? 
                        <Button onPress={() => handleForgotPassword()} accessoryRight={EmailIcon}>
                            Send Password Reset Email
                        </Button>
                        :
                        <Button appearance='outline'>
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
    }
});
