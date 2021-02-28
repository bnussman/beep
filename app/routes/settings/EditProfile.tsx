import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Button, Input, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { AuthenticatedUserContextData, UserContext } from '../../utils/UserContext';
import { config } from "../../utils/config";
import { EditIcon, LoadingIndicator } from "../../utils/Icons";
import { handleFetchError } from "../../utils/Errors";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackIcon } from '../../utils/Icons';
import AsyncStorage from '@react-native-community/async-storage';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainNavParamList} from '../../navigators/MainTabs';

interface Props {
    navigation: BottomTabNavigationProp<MainNavParamList>;
}

interface State {
    isLoading: boolean;
    username: string;
    first: string;
    last: string;
    email: string;
    phone: string;
    venmo: string;
}

export class EditProfileScreen extends Component<Props, State> {
    static contextType = UserContext;
    
    constructor(props: Props, context: AuthenticatedUserContextData) {
        super(props);
        this.state = {
            isLoading: false,
            username: context.user.username,
            first: context.user.first,
            last: context.user.last,
            email: context.user.email,
            phone: context.user.phone,
            venmo: context.user.venmo
        };
    }

    async handleUpdate(): Promise<void> {
        this.setState({ isLoading: true });

        try {
            const result = await fetch(config.apiUrl + "/account", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.context.user.token}`
                },
                body: JSON.stringify({
                    first: this.state.first,
                    last: this.state.last,
                    email: this.state.email,
                    phone: this.state.phone,
                    venmo: this.state.venmo
                })
            })

            const data = await result.json();

            if (data.status === "success") {
                //make a copy of the current user
                const tempUser = this.context.user;

                //update the tempUser with the new data
                tempUser.first = this.state.first;
                tempUser.last = this.state.last;
                tempUser.email = this.state.email;
                tempUser.phone = this.state.phone;
                tempUser.venmo = this.state.venmo;

                if (this.state.email !== this.context.user.email) {
                    //email has changed for sure, set to not verified on client side
                    tempUser.isEmailVerified = false;
                    tempUser.isStudent = false;
                }

                //update the context
                this.context.setUser(tempUser);

                //put the tempUser back into storage
                AsyncStorage.setItem('@user', JSON.stringify(tempUser));

                //on success, go back to settings page
                this.props.navigation.goBack();
            }
            else {
                this.setState({
                    isLoading: false,
                    username: this.context.user.username,
                    first: this.context.user.first,
                    last: this.context.user.last,
                    email: this.context.user.email,
                    phone: this.context.user.phone,
                    venmo: this.context.user.venmo
                });
                handleFetchError(data.message);
            }
        }
        catch(error) {
            this.setState({ isLoading: handleFetchError(error) });
        }
    }

    UNSAFE_componentWillReceiveProps(): void {
        if (this.state.first != this.context.user.first) {
            this.setState({ first: this.context.user.first });
        }
        if (this.state.last != this.context.user.last) {
            this.setState({ last: this.context.user.last });
        }
        if (this.state.email != this.context.user.email) {
            this.setState({ email: this.context.user.email });
        }
        if (this.state.phone != this.context.user.phone) {
            this.setState({ phone: this.context.user.phone });
        }
        if (this.state.venmo != this.context.user.venmo) {
            this.setState({ venmo: this.context.user.venmo });
        }
    }

    render() {
        const BackAction = () => (
            <TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
        );

        return (
            <>
                <TopNavigation title='Edit Profile' alignment='center' accessoryLeft={BackAction}/>
                <Layout style={{flex: 1}}>
                <KeyboardAwareScrollView scrollEnabled={false} extraScrollHeight={70}>
                <Layout style={styles.container}>
                    <Layout style={styles.form}>
                        <Input
                            label="Username"
                            value={this.state.username}
                            textContentType="username"
                            placeholder="Username"
                            disabled={true} />
                        <Input
                            label="First Name"
                            value={this.state.first}
                            textContentType="givenName"
                            placeholder="First Name"
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({first:text})}
                            onSubmitEditing={() => this.secondTextInput.focus()} />
                        <Input
                            label="Last Name"
                            value={this.state.last}
                            textContentType="familyName"
                            placeholder="Last Name"
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({last:text})}
                            ref={(input)=>this.secondTextInput = input}
                            onSubmitEditing={() => this.thirdTextInput.focus()} />
                        <Input
                            label="Email"
                            value={this.state.email}
                            textContentType="emailAddress"
                            placeholder="Email"
                            caption={this.context.user.isEmailVerified ? (this.context.user.isStudent) ? "Your email is verified and you are a student": "Your email is verified" : "Your email is not verified"}
                            returnKeyType="next"
                            onChangeText={(text) => this.setState({email:text})}
                            ref={(input) => this.thirdTextInput = input}
                            onSubmitEditing={() => this.fourthTextInput.focus()} />
                        <Input
                            label="Phone Number"
                            value={this.state.phone}
                            textContentType="telephoneNumber"
                            placeholder="Phone Number"
                            returnKeyType="next"
                            style={{marginTop: 5}}
                            onChangeText={(text) => this.setState({phone:text})}
                            ref={(input)=>this.fourthTextInput = input}
                            onSubmitEditing={()=>this.fifthTextInput.focus()} />
                        <Input
                            label="Venmo Username"
                            value={this.state.venmo}
                            textContentType="username"
                            placeholder="Venmo Username"
                            returnKeyType="go"
                            onChangeText={(text) => this.setState({venmo:text})}
                            ref={(input)=>this.fifthTextInput = input}
                            onSubmitEditing={() => this.handleUpdate()} />
                        {!this.state.isLoading ?
                            <Button
                                onPress={() => this.handleUpdate()}
                                accessoryRight={EditIcon}
                            >
                                Update Profile
                            </Button>
                            :
                            <Button
                                appearance="outline"
                                accessoryRight={LoadingIndicator}
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
