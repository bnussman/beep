import React, { useState } from 'react';
import { Layout, Button, Input, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { BackIcon, EmailIcon } from "../../utils/Icons";
import { gql, useMutation } from '@apollo/client';
import { ForgotPasswordMutation } from '../../generated/graphql';
import { Navigation } from '../../utils/Navigation';
import { isMobile } from '../../utils/config';

interface Props {
  navigation: Navigation;
}

const ForgotPassword = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;

export function ForgotPasswordScreen(props: Props): JSX.Element {
  const [forgot, { loading }] = useMutation<ForgotPasswordMutation>(ForgotPassword);
  const [email, setEmail] = useState<string>("");

  async function handleForgotPassword() {
    try {
      await forgot({
        variables: { email }
      });

      alert("Check your email for a link to reset your password");
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
      <TopNavigation title='Forgot Password' alignment='center' accessoryLeft={BackAction} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!isMobile} >
        <Layout style={styles.container}>
          <Layout style={styles.form}>
            <Input
              textContentType="emailAddress"
              placeholder="example@ridebeep.app"
              returnKeyType="go"
              onChangeText={(text) => setEmail(text)}
              onSubmitEditing={() => handleForgotPassword()} />
            {!loading ?
              <Button
                onPress={() => handleForgotPassword()}
                accessoryRight={EmailIcon}
                disabled={!email}
              >
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
