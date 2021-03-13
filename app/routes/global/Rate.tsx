import React, { useState } from "react";
import { Platform, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native"
import { Input, Button, Layout, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { BackIcon } from "../../utils/Icons";
import { LoadingIndicator, ReportIcon } from "../../utils/Icons";
import { gql, useMutation } from "@apollo/client";
import { RateUserMutation } from "../../generated/graphql";

interface Props {
    route: any;
    navigation: any;
}

const RateUser = gql`
    mutation RateUser($userId: String!, $stars: Float!, $message: String, $beepId: String) {
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
    const [stars, setStars] = useState<number>();
    const [message, setMessage] = useState<string>();
    const [rate, { data, loading, error }] = useMutation<RateUserMutation>(RateUser, { errorPolicy: 'all' });

    async function rateUser() {
        const result = await rate({
            variables: {
                userId: props.route.params.id,
                beepId: props.route.params.beep,
                message: message,
                stars: stars
            }
        });
        if (result) alert("Successfully Rated User");
        else alert(error);
    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()}/>
    );

    return (
        <>
        <TopNavigation title='Rate User' alignment='center' accessoryLeft={BackAction}/>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!(Platform.OS == "ios" || Platform.OS == "android")} >
            <Layout style={styles.container}>            
                <Layout style={styles.form}>
                    <Input
                        placeholder="User"
                        label="User"
                        value={props.route.params.first + " " + props.route.params.last}
                        disabled={true}
                    />
                    <Input
                        label="Stars"
                        placeholder="0-5"
                        onChangeText={(value) => setStars(Number(value))}
                        blurOnSubmit={true}
                    />
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
                        <Button accessoryRight={ReportIcon} onPress={() => rateUser()}>
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
