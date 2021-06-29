import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Button, Input, TopNavigation, TopNavigationAction, Text } from '@ui-kitten/components';
import { UserContext } from '../../utils/UserContext';
import { EditIcon, LoadingIndicator } from "../../utils/Icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackIcon } from '../../utils/Icons';
import { gql, useMutation } from '@apollo/client';
import { EditAccountMutation, Maybe } from '../../generated/graphql';

interface Props {
    navigation: any;
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

export function EditProfileScreen(props: Props) {
    const user = useContext(UserContext);
    const [edit, { data, loading, error }] = useMutation<EditAccountMutation>(EditAccount);

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

    async function handleUpdate() {
        const result = await edit({
            variables: {
                first: first,
                last: last,
                email: email,
                phone: phone,
                venmo: venmo,
                cashapp: cashapp
            }
        });
        if (result) alert("Successfully updated profile");
        if (error) alert(error.message);
    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()}/>
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
                                value={username}
                                textContentType="username"
                                placeholder="Username"
                                disabled={true}
                            />
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
                            <Input
                                label="Email"
                                ref={emailRef}
                                value={email}
                                textContentType="emailAddress"
                                placeholder="Email"
                                caption={user.isEmailVerified ? (user.isStudent) ? "Your email is verified and you are a student": "Your email is verified" : "Your email is not verified"}
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
                                style={{marginTop: 5}}
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
    }
});
