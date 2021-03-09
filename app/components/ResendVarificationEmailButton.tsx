import React from 'react';
import { Button } from '@ui-kitten/components';
import { EmailIcon, LoadingIndicator } from '../utils/Icons';
import {gql, useMutation} from '@apollo/client';
import {ResendMutation} from '../generated/graphql';

const Resend = gql`
    mutation Resend {
      resendEmailVarification
    }
`;

function ResendButton(props) {
    const [resend, { data, loading, error }] = useMutation<ResendMutation>(Resend);

    async function resendEmailVarification() {
        const result = await resend();
        if (result) alert("Successfuly resent varification email");
        else alert(error);
    }

    if (loading) {
        return (
            <Button appearance='ghost' accessoryLeft={LoadingIndicator} style={{ marginBottom: 10 }}>
                Loading
            </Button>
        );
    }
    
    return(
        <Button
            onPress={() => resendEmailVarification()}
            accessoryLeft={EmailIcon}
            style={{ marginBottom: 10 }}
            appearance='ghost'
        >
                Resend Varification Email
        </Button>
    );
}

export default ResendButton;
