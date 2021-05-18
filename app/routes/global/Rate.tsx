import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native"
import { Text, Input, Button, Layout, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { BackIcon } from "../../utils/Icons";
import { LoadingIndicator, RateIcon } from "../../utils/Icons";
import { gql, useMutation } from "@apollo/client";
import { RateUserMutation } from "../../generated/graphql";
import { RateBar } from "../../components/Rate";
import ProfilePicture from "../../components/ProfilePicture";

interface Props {
    route: any;
    navigation: any;
}

const RateUser = gql`
    mutation RateUser($userId: String!, $stars: Float!, $message: String, $beepId: String!) {
      rateUser(
        input: {
          userId: $userId,
          beepId: $beepId,
          stars: $stars,
          message: $message
        }
      )
    }
`;

export function RateScreen(props: Props) {
    const [stars, setStars] = useState<number>(0);
    const [message, setMessage] = useState<string>();
    const [rate, { loading }] = useMutation<RateUserMutation>(RateUser, { errorPolicy: 'all' });

    async function rateUser() {
        if (stars < 1) return alert("Please rate the user");
        try {
            const result = await rate({
                refetchQueries: () => ["GetRateData"],
                variables: {
                    userId: props.route.params.id,
                    beepId: props.route.params.beep,
                    message: message,
                    stars: stars
                }
            });
            if (result) props.navigation.goBack();
        }
        catch (error) {
            alert(error);
        }
    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()}/>
    );

    function UserHeader(props: any) {
        return <Layout style={{flexDirection: 'row', marginHorizontal: -16}}>
            {props.user.photoUrl &&
            <ProfilePicture
                style={{marginHorizontal: 8}}
                size={50}
                url={props.user.photoUrl}
            />
            }
            <Layout>
                <Text category='h4'>
                    {props.user.name}
                </Text>
                <Text
                    appearance='hint'
                    category='s1'>
                    {props.user.username}
                </Text>
            </Layout>
        </Layout>
    }

    return (
        <>
        <TopNavigation title='Rate User' alignment='center' accessoryLeft={BackAction}/>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!(Platform.OS == "ios" || Platform.OS == "android")} >
            <Layout style={styles.container}>            
                <Layout style={styles.form}>
                    {useMemo(() => <UserHeader user={props.route.params.user} />, [])}
                    <Layout style={{marginTop:15, marginBottom:15}}>
                        <RateBar
                            hint="Stars"
                            value={stars}
                            onValueChange={setStars}
                        />
                    </Layout>
                    <Input
                        label="Message"
                        multiline={true}
                        placeholder="Your rating message goes here"
                        returnKeyType="go"
                        textStyle={{ minHeight: 64 }}
                        onChangeText={(text) => setMessage(text)}
                        onSubmitEditing={() => rateUser()}
                        blurOnSubmit={true}
                    />
                    {!loading ?
                        <Button accessoryRight={RateIcon} onPress={() => rateUser()}>
                            Rate User
                        </Button>
                        :
                        <Button appearance='outline' accessoryRight={LoadingIndicator}>
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
        flex: 1 ,
        alignItems: "center"
    },
    form: {
        marginTop: 20,
        width: "90%"
    }
});
