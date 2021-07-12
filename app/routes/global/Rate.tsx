import React, { useMemo, useState } from "react";
import { StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native"
import { Input, Button, Layout, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { BackIcon } from "../../utils/Icons";
import { LoadingIndicator, RateIcon } from "../../utils/Icons";
import { gql, useMutation } from "@apollo/client";
import { RateUserMutation } from "../../generated/graphql";
import { RateBar } from "../../components/Rate";
import { isMobile } from "../../utils/config";
import { UserHeader } from "../../components/UserHeader";
import { Navigation } from "../../utils/Navigation";

interface Props {
    route: any;
    navigation: Navigation;
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

export function RateScreen(props: Props): JSX.Element {
    const [stars, setStars] = useState<number>(0);
    const [message, setMessage] = useState<string>();
    const [rate, { loading }] = useMutation<RateUserMutation>(RateUser);

    async function rateUser() {
        try {
            await rate({
                refetchQueries: () => ["GetRateData"],
                variables: {
                    userId: props.route.params.user.id,
                    beepId: props.route.params.beep,
                    message: message,
                    stars: stars
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
        <TopNavigation title='Rate User' alignment='center' accessoryLeft={BackAction}/>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!isMobile} >
            <Layout style={styles.container}>            
                <Layout style={styles.form}>
                    {useMemo(() => <UserHeader user={props.route.params.user} />, [])}
                    <Layout style={{ marginTop: 15, marginBottom: 15 }}>
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
                        <Button
                          accessoryRight={RateIcon}
                          onPress={() => rateUser()}
                          disabled={stars < 1}
                          style={{ marginTop: 8 }}
                        >
                            Rate User
                        </Button>
                        :
                        <Button
                          appearance='outline'
                          accessoryRight={LoadingIndicator}
                          style={{ marginTop: 8 }}
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
        flex: 1 ,
        alignItems: "center"
    },
    form: {
        marginTop: 20,
        width: "90%"
    }
});
