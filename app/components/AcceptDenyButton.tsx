import React, { Component, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Button } from "@ui-kitten/components";
import { UserContext } from '../utils/UserContext';
import { config } from "../utils/config";
import { AcceptIcon, DenyIcon, AcceptIndicator, DenyIndicator } from "../utils/Icons";
import { handleFetchError } from "../utils/Errors";

interface Props {
    type: string;
    item: { id: string, riderid: string };
}

interface State {
    isLoading: boolean;
}

export default class AcceptDenyButton extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    UNSAFE_componentWillReceiveProps(): void {
        this.setState({ isLoading: false });
    }

    async updateStatus(queueID: string, riderID: string, value: string | boolean): Promise<void> {
        this.setState({ isLoading: true });

        try {
            const result = await fetch(config.apiUrl + "/beeper/queue/status", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.context.user.token}`
                },
                body: JSON.stringify({
                    value: value,
                    queueID: queueID,
                    riderID: riderID
                })
            });

            const data = await result.json();

            if (data.status === "error") {
                this.setState({ isLoading: handleFetchError(data.message) });
            }
        }
        catch (error) {
            this.setState({ isLoading: handleFetchError(error) });
        }
    }
    

    render(): ReactNode {
        if (this.state.isLoading) {
            return(
                <Button style={styles.button} appearance="outline" status={(this.props.type == "accept") ? "success" : "danger" } accessoryLeft={(this.props.type == "accept") ? AcceptIndicator : DenyIndicator }>
                    Loading
                </Button>
            );
        }

        return (
            <Button style={styles.button} status={(this.props.type == "accept") ? "success" : "danger" } accessoryLeft={(this.props.type == "accept") ? AcceptIcon : DenyIcon } onPress={()=> this.updateStatus(this.props.item.id, this.props.item.riderid, this.props.type)}>
                {(this.props.type == "accept") ? "Accept" : "Deny" }
            </Button>
        );
    }
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
