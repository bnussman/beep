import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Layout, Button, Input, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { EditIcon, LoadingIndicator, BackIcon } from "../../utils/Icons";
import { gql, useMutation } from '@apollo/client';
import { ChangePasswordMutation } from '../../generated/graphql';
import { Navigation } from '../../utils/Navigation';
import { isMobile } from '../../utils/config';

interface Props {
  navigation: Navigation;
}

const ChangePassword = gql`
    mutation ChangePassword($password: String!) {
        changePassword (input: {password: $password})
    }
  `;

export function ChangePasswordScreen(props: Props): JSX.Element {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [changePassword, { loading }] = useMutation<ChangePasswordMutation>(ChangePassword);
  const confirmPasswordRef = useRef<any>();

  async function handleChangePassword() {
    try {
      await changePassword({
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
    <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()} />
  );

  return (
    <>
      <TopNavigation title='Change Password' alignment='center' accessoryLeft={BackAction} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!isMobile} >
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
                disabled={!password || password !== confirmPassword}
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
