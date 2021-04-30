import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Spinner } from "@ui-kitten/components";
import { gql, useMutation } from "@apollo/client";
import { CancelBeepMutation, UpdateBeeperQueueMutation } from "../generated/graphql";

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

        if (loading) {
            return (
                <Button size="giant" appearance='outline' accessoryLeft={LoadingIndicator}>
                    Loading
                </Button>
            );
        }

        if (props.index != 0) {
            return (
                <Button
                    size="medium"
                    status="danger"
                    onPress={() => cancelBeep({ variables: { id: props.item.id } })}
                >
                    Cancel Beep
                </Button>
            );
        }

        return (
            <Button size="giant" onPress={() => updateStatus(props.item.id, props.item.rider.id, (props.item.state < 3) ? "next" : "complete")}>
                {getMessage()}
            </Button>
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
