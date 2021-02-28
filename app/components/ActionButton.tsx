import React, { Component, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Spinner } from "@ui-kitten/components";
import { UserContext } from '../utils/UserContext';
import { config } from "../utils/config";
import { handleFetchError } from "../utils/Errors";

interface Props {
    item: { id: string, riderid: string, state: number };
}

interface State {
    isLoading: boolean;
}

const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size='small'/>
  </View>
);

export default class ActionButton extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false
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
        catch(error) {
            this.setState({ isLoading: handleFetchError(error) });
        }
    }

    getMessage(): string {
        switch(this.props.item.state) {
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

    render(): ReactNode {
        if (this.state.isLoading) {
            return (
                <Button size="giant" appearance='outline' accessoryLeft={LoadingIndicator}>
                    Loading
                </Button>
            );
        }

        return (
            <Button size="giant" onPress={() => this.updateStatus(this.props.item.id, this.props.item.riderid, (this.props.item.state < 3) ? "next" : "complete")}>
                {this.getMessage()}
            </Button>
        ) 
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
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
