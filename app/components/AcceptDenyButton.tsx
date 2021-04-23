import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "@ui-kitten/components";
import { AcceptIcon, DenyIcon, AcceptIndicator, DenyIndicator } from "../utils/Icons";
import { gql, useMutation } from "@apollo/client";
import { UpdateBeeperQueueMutation } from "../generated/graphql";

interface Props {
    type: string;
    item: any;
}

const UpdateBeeperQueue = gql`
mutation UpdateBeeperQueue($queueId: String!, $riderId: String!, $value: String!) {
	setBeeperQueue(input: {
    queueId: $queueId,
    riderId: $riderId,
    value: $value
  })
}
`;

function AcceptDenyButton(props: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [update] = useMutation<UpdateBeeperQueueMutation>(UpdateBeeperQueue);

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
            alert(error.message);
        }

        setLoading(false);
    }

    if (loading) {
        return(
            <Button style={styles.button} appearance="outline" status={(props.type == "accept") ? "success" : "danger" } accessoryLeft={(props.type == "accept") ? AcceptIndicator : DenyIndicator }>
                Loading
            </Button>
        );
    }

    return (
        <Button style={styles.button} status={(props.type == "accept") ? "success" : "danger" } accessoryLeft={(props.type == "accept") ? AcceptIcon : DenyIcon } onPress={()=> updateStatus(props.item.id, props.item.rider.id, props.type)}>
            {(props.type == "accept") ? "Accept" : "Deny" }
        </Button>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        margin: 2,
    },
});

export default AcceptDenyButton;
