import { gql, useMutation } from '@apollo/client';
import React, { FormEvent, useState } from 'react';
import {ResetPasswordMutation} from '../generated/graphql';
import { Error } from '../components/Error';
import {Success} from '../components/Success';
import { Button, Input } from '@chakra-ui/react';

const Reset = gql`
    mutation ResetPassword($id: String!, $password: String!) {
        resetPassword(id: $id, password: $password)
    }
`;

function ResetPassword({ match }) {
    const id = match.params.id;
    const [password, setPassword] = useState<string>("");
    const [reset, {data, loading, error}] = useMutation<ResetPasswordMutation>(Reset);
    
    async function handleResetPassword(e: FormEvent): Promise<void> {
        e.preventDefault();
        try {
            await reset({ variables: { id: id, password: password }});
        }
        catch (error) {
            //...
        }
    }

    return (
        <div>
            {loading && <p>Loading</p>}
            {error && <Error error={error}/>}
            {data && <Success message="Successfully changed password"/>}
            <form onSubmit={handleResetPassword}>
                <label htmlFor="password">
                    New Password
                </label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="password"
                    placeholder="Password"
                    onChange={(value: any) => setPassword(value.target.value)}
                    disabled={data?.resetPassword}
                />
                <Button 
                    type="submit"
                    disabled={data?.resetPassword}
                >
                    Reset Password
                </Button>
            </form>
        </div>
    );
}

export default ResetPassword;
