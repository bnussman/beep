import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Spinner } from "@ui-kitten/components";
import { gql, useMutation } from "@apollo/client";
import { CancelBeepMutation, UpdateBeeperQueueMutation } from "../generated/graphql";
import {isMobile} from "../utils/config";

interface Props {
    item: any;
    index: number;
}

const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size='small'/>
  </View>
);

const UpdateBeeperQueue = gql`
    mutation UpdateBeeperQueue($queueId: String!, $riderId: String!, $value: String!) {
        setBeeperQueue(input: {
            queueId: $queueId,
            riderId: $riderId,
            value: $value
        })
    }
`;

const CancelBeep = gql`
    mutation CancelBeep($id: String!) {
        cancelBeep(id: $id)
    }
`;

function ActionButton(props: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [update] = useMutation<UpdateBeeperQueueMutation>(UpdateBeeperQueue);
    const [cancelBeep] = useMutation<CancelBeepMutation>(CancelBeep);

    useEffect( () => { setLoading(false) }, [ props.item.state ] );

    async function updateStatus(queueId: string, riderId: string, value: string | boolean): Promise<void> {
        setLoading(true);
       
        try {
            await update({
                variables: {
                    queueId: queueId,
                    riderId: riderId,
                    value: value
                }
            });
        }
        catch (error) {
            alert(error);
        }
    }

    function cancelBeepWrapper() {
        if (isMobile) {
            Alert.alert(
                "Cancel Beep?",
                "Are you sure you want to cancel this beep?",
                [
                    {
                        text: "No",
                        onPress: () => console.log("No Pressed"),
                            style: "cancel"
                    },
                    { text: "Yes", onPress: () => cancelBeep({ variables: { id: props.item.id } }) }
                ],
                { cancelable: true }
            );
        }
        else {
            cancelBeep({ variables: { id: props.item.id } });
        }
        
    }

    function getMessage(): string {
        switch(props.item.state) {
            case 0:
                return "I'm on the way";
            case 1:
                return "I'm here";
            case 2:
                return "I'm now beeping this rider";
            case 3:
                return "I'm done beeping this rider";
            default:
                return "Yikes";
        }
    }

    const CancelButton = () => {
        return (
            <Button
                size="medium"
                status="danger"
                onPress={() => cancelBeepWrapper()}
            >
                Cancel Beep
            </Button>
        );
    }

    const LoadingButton = () => {
        return (
            <Button
                size="giant"
                appearance='outline'
                accessoryLeft={LoadingIndicator}
                style={{marginBottom: 4}}
            >
                Loading
            </Button>
        );
    }

    if (props.index != 0) {
        return <CancelButton/>
    }

    return (
        <>
            {loading ?
                <LoadingButton/>
                :
                <Button
                    size="giant"
                    style={{marginBottom: 4}}
                    onPress={() => updateStatus(props.item.id, props.item.rider.id, (props.item.state < 3) ? "next" : "complete")}
                >
                    {getMessage()}
                </Button>
            }
            <CancelButton/>
        </>
    ) 
} 

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        margin: 2,
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ActionButton;
