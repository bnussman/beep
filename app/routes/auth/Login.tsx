import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import * as SplashScreen from 'expo-splash-screen';
import { UserContext } from '../../utils/UserContext';
import { removeOldToken } from '../../utils/OfflineToken';
import { getPushToken } from '../../utils/Notifications';
import { config } from '../../utils/config';
import { LoginIcon, SignUpIcon, QuestionIcon, LoadingIndicator } from '../../utils/Icons';
import { handleFetchError } from "../../utils/Errors";
import { Icon } from '@ui-kitten/components';
import socket from "../../utils/Socket";

interface Props {
    navigation: any;
}

interface State {
    isLoading: boolean;
    username: string;
    password: string;
    secureTextEntry: boolean;
}

export default class LoginScreen extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            secureTextEntry: true,
            username: "",
            password: ""
        };
    }

    toggleSecureEntry() {
        this.setState({ secureTextEntry: !this.state.secureTextEntry });
    }

    renderIcon = (props: unknown) => (
        <TouchableWithoutFeedback onPress={() => this.toggleSecureEntry()}>
            <Icon {...props} name={this.state.secureTextEntry ? 'eye-off' :'eye'}/>
        </TouchableWithoutFeedback>
    );

    componentDidMount() {
        try {
            SplashScreen.hideAsync();
        }
        catch (error) {
            console.log(error);
        }
    }

    async handleLogin() {
        this.setState({ isLoading: true });

        removeOldToken();

        let expoPushToken;

        if (Platform.OS == "ios" || Platform.OS == "android") {
            expoPushToken = await getPushToken();
        }

        try {
            const result = await fetch(config.apiUrl + "/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    pushToken: expoPushToken
                })
            });

            const data = await result.json();

            if (data.status === "success") {
                this.context.setUser(data);

                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'Main' },
                    ],
                });

                AsyncStorage.setItem("@user", JSON.stringify(data));

                socket.emit('getUser', this.context.user.token);
            }
            else {
                this.setState({ isLoading: handleFetchError(data.message) });
            }
        }
        catch (error) {
            this.setState({ isLoading: handleFetchError(error) });
        }
    }

    render () {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!(Platform.OS == "ios" || Platform.OS == "android")} >
                <Layout style={styles.container}>
                    <Text style={styles.title} category='h6'>Login</Text>
                    <Layout style={styles.form}>
                        <Input
                            textContentType="username"
                            placeholder="Username"
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({ username: text })}
                            onSubmitEditing={() => this.secondTextInput.focus()}
                            blurOnSubmit={true}
                        />
                        <Input
                            textContentType="password"
                            placeholder="Password"
                            returnKeyType="go"
                            accessoryRight={this.renderIcon}
                            secureTextEntry={this.state.secureTextEntry}
                            onChangeText={(text) => this.setState({ password: text })}
                            ref={(input) => this.secondTextInput = input}
                            onSubmitEditing={() => this.handleLogin()}
                            blurOnSubmit={true}
                        />
                        {!this.state.isLoading ?
                            <Button
                                accessoryRight={LoginIcon}
                                onPress={() => this.handleLogin()}
                            >
                            Login
                            </Button>
                            :
                            <Button appearance='outline' accessoryRight={LoadingIndicator}>
                                Loading
                            </Button>
                        }
                    </Layout>
                    <Text style={{marginTop: 30, marginBottom: 10 }}> Don't have an account? </Text>
                    <Button
                        size="small"
                        onPress={() => this.props.navigation.navigate('Register')}
                        appearance="outline"
                        accessoryRight={SignUpIcon}
                    >
                    Sign Up
                    </Button>
                    <Text style={{marginTop: 20, marginBottom: 10}}> Forgot your password? </Text>
                    <Button
                        size="small"
                        onPress={() => this.props.navigation.navigate('ForgotPassword')}
                        appearance="outline"
                        accessoryRight={QuestionIcon}
                    >
                    Forgot Password
                    </Button>
                </Layout>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 100
    },
    form: {
        justifyContent: "center",
        width: "83%",
        marginTop: 20,
    },
    title: {
        fontSize: 40,
        padding: 15,
    },
});
