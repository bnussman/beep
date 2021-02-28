import React, { Component } from 'react';
import { config } from "../utils/config";
import { handleFetchError } from "../utils/Errors";
import { UserContext } from '../utils/UserContext';
import { Button } from '@ui-kitten/components';
import { EmailIcon, LoadingIndicator } from '../utils/Icons';

interface State {
    isLoading: boolean;
}

export default class ResendButton extends Component<undefined, State> {
    static contextType = UserContext;

    constructor() {
        super(undefined);
        this.state = {
            isLoading: false
        };
    }

    async resendEmailVerification(): Promise<void> {
        this.setState({ isLoading: true });
        try {
            const result = await fetch(config.apiUrl + "/account/verify/resend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.context.user.token}`
                }
            });

            const data = await result.json();
            this.setState({ isLoading: false });
            alert(data.message);
        }
        catch (error) {
            this.setState({ isLoading: handleFetchError(error) });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Button appearance='ghost' accessoryLeft={LoadingIndicator} style={{ marginBottom: 10 }}>
                    Loading
                </Button>
            );
        }
        
        return(
            <Button
                onPress={() => this.resendEmailVerification()}
                accessoryLeft={EmailIcon}
                style={{ marginBottom: 10 }}
                appearance='ghost'
            >
                    Resend Varification Email
            </Button>
        );
    }
}
