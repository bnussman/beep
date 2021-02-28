import React, { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { config } from '../utils/config';
import { Button, TextInput } from '../components/Input';
import APIResultBanner from '../components/APIResultBanner';
import {gql, useMutation} from '@apollo/client';
import {ForgotPasswordMutation} from '../generated/graphql';

interface Status {
    status: string;
    message: string;
}

const ForgotPasswordGraphQL = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;

function ForgotPassword() {
    const [forgot, { data, loading, error }] = useMutation<ForgotPasswordMutation>(ForgotPasswordGraphQL);
    const { user } = useContext(UserContext);
    const [email, setEmail] = useState("");

    async function handleForgotPassword(e: FormEvent): Promise<void> {
        e.preventDefault();
        try {
            const response = await forgot({ variables: {
                email: email
            }});
        }
        catch(error) {
            console.error('Error:', error);
        }
    }

    if(user) {
        return <Redirect to={{ pathname: "/"}} />;
    }
    
    return (
        <div className="lg:container px-4 mx-auto">
            {error && error.message}
            {loading && <p>Loading</p>}
            {data?.forgotPassword && <p>Successfully sent password reset email</p>}
            <form onSubmit={handleForgotPassword}>
                <TextInput
                    className="mb-4"
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="example@ridebeep.app"
                    onChange={(value: any) => setEmail(value.target.value)}
                    disabled={data?.forgotPassword}
                />
                <Button raised className={data?.forgotPassword ? 'opacity-50 cursor-not-allowed' : ''}>
                    Send Reset Password Email
                </Button>
            </form>
        </div>
    );
}

export default ForgotPassword;
