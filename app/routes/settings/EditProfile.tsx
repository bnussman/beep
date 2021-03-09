import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Button, Input, TopNavigation, TopNavigationAction, Text } from '@ui-kitten/components';
import { UserContext } from '../../utils/UserContext';
import { EditIcon, LoadingIndicator } from "../../utils/Icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackIcon } from '../../utils/Icons';
import { gql, useMutation } from '@apollo/client';
import { EditAccountMutation } from '../../generated/graphql';

interface Props {
    navigation: any;
}

const EditAccount = gql`
    mutation EditAccount($first: String, $last: String, $email: String, $phone: String, $venmo: String) {
        editAccount (
            input: {
                first : $first,
                last: $last,
                email: $email,
                phone: $phone,
                venmo: $venmo
            }
        ) {
        id
        name
        }
    }
`;

export function EditProfileScreen(props: Props) {
    const userContext = useContext(UserContext);
    const [edit, { data, loading, error }] = useMutation<EditAccountMutation>(EditAccount);

    const [username] = useState<string | undefined>(userContext?.user?.user.username);
    const [first, setFirst] = useState<string | undefined>(userContext?.user?.user.first);
    const [last, setLast] = useState<string | undefined>(userContext?.user?.user.last);
    const [email, setEmail] = useState<string | undefined>(userContext?.user?.user.email);
    const [phone, setPhone] = useState<string | undefined>(userContext?.user?.user.phone);
    const [venmo, setVenmo] = useState<string | undefined>(userContext?.user?.user.venmo);

    useEffect(() => {
        if (first !== userContext?.user?.user.first) setFirst(userContext?.user?.user.first);
        if (last !== userContext?.user?.user.last) setLast(userContext?.user?.user.last);
        if (email !== userContext?.user?.user.email) setEmail(userContext?.user?.user.email);
        if (phone !== userContext?.user?.user.first) setPhone(userContext?.user?.user.phone);
        if (venmo !== userContext?.user?.user.venmo) setVenmo(userContext?.user?.user.venmo);
    }, [userContext?.user]);

    function handleUpdate() {
        edit({ variables: {
            first: first,
            last: last,
            email: email,
            phone: phone,
            venmo: venmo
        }});
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
                        {data && <Text>Success</Text>}
                        {error && <Text>{error.message}</Text>}
                        <Layout style={styles.form}>
                            <Input
                                label="Username"
                                value={username}
                                textContentType="username"
                                placeholder="Username"
                                disabled={true} />
                            <Input
                                label="First Name"
                                value={first}
                                textContentType="givenName"
                                placeholder="First Name"
                                returnKeyType="next"
                                onChangeText={(text) => setFirst(text)}
                            />
                            <Input
                                label="Last Name"
                                value={last}
                                textContentType="familyName"
                                placeholder="Last Name"
                                returnKeyType="next"
                                onChangeText={(text) => setLast(text)}
                            />
                            <Input
                                label="Email"
                                value={email}
                                textContentType="emailAddress"
                                placeholder="Email"
                                caption={userContext?.user?.user.isEmailVerified ? (userContext.user.user.isStudent) ? "Your email is verified and you are a student": "Your email is verified" : "Your email is not verified"}
                                returnKeyType="next"
                                onChangeText={(text) => setEmail(text)}
                            />
                            <Input
                                label="Phone Number"
                                value={phone}
                                textContentType="telephoneNumber"
                                placeholder="Phone Number"
                                returnKeyType="next"
                                style={{marginTop: 5}}
                                onChangeText={(text) => setPhone(text)}
                            />
                            <Input
                                label="Venmo Username"
                                value={venmo}
                                textContentType="username"
                                placeholder="Venmo Username"
                                returnKeyType="go"
                                onChangeText={(text) => setVenmo(text)}
                                onSubmitEditing={() => handleUpdate()}
                            />
                            {!loading ?
                                <Button
                                    onPress={() => handleUpdate()}
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
