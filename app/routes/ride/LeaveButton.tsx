import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { config } from '../../utils/config';
import { handleFetchError } from '../../utils/Errors';
import { LeaveIcon } from '../../utils/Icons';
import { Button } from '@ui-kitten/components';
import { UserContext } from '../../utils/UserContext';
import { isMobile } from '../../utils/config';

interface Props {
    beepersId: string; 
}

interface State {
    isLoading: boolean;
}

export default class LeaveButton extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    leaveQueueWrapper(): void {
        if (isMobile) {
            Alert.alert(
                "Leave Queue?",
                "Are you sure you want to leave this queue?",
                [
                    {
                        text: "No",
                        onPress: () => console.log("No Pressed"),
                            style: "cancel"
                    },
                    { text: "Yes", onPress: () => this.leaveQueue() }
                ],
                { cancelable: true }
            );
        }
        else {
            this.leaveQueue();
        }
    }

    async leaveQueue(): Promise<void> {
        this.setState({ isLoading: true });

        try {
            const result = await fetch(config.apiUrl + "/rider/leave", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.context.user.token
                },
                body: JSON.stringify({
                    beepersID: this.props.beepersId
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

    render() {
        if (this.state.isLoading) {
            return (
                <Button appearance='outline' status='danger' style={styles.button}>
                    Loading
                </Button>
            );
        }
        else {
            return (
            <Button
                status='danger'
                style={styles.button}
                accessoryRight={LeaveIcon}
                onPress={() => this.leaveQueueWrapper()}
            >
                Leave Queue
            </Button>
            );
        }
    }
}

const styles = StyleSheet.create({
    button: {
        width: "85%"
    }
});
