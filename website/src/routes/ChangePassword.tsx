import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { Error } from '../components/Error';
import { gql, useMutation } from '@apollo/client';
import { ChangePasswordMutation } from '../generated/graphql';
import { Success } from '../components/Success';
import { Input, Button, FormControl, FormLabel } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';

const ChangePasswordGraphQL = gql`
    mutation ChangePassword($password: String!) {
        changePassword (input: {password: $password})
    }
`;

function ChangePassword() {
    const [changePassword, { data, loading, error }] = useMutation<ChangePasswordMutation>(ChangePasswordGraphQL);
    const user = useContext(UserContext);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    if (!user) {
        return <Redirect to={{ pathname: "/login" }} />;
    }

    async function handleEdit(e: any): Promise<void> {
        e.preventDefault();

        try {
            await changePassword({ variables: {
                password: password
            }});
            setPassword('');
            setConfirmPassword('');
        }
        catch(error) {
            console.error(error);
        }
    }

    return (
        <div>
            {data?.changePassword && <Success message="Successfully changed your password"/>}
            {error && <Error error={error} />}
            <form onSubmit={handleEdit}>
                <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(value: any) => setPassword(value.target.value)}
                    />
                </FormControl>
                <FormControl id="password2" mt={2} mb={2}>
                    <FormLabel>Repreat Password</FormLabel>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(value: any) => setConfirmPassword(value.target.value)}
                    />
                </FormControl>
                <Button
                  isLoading={loading}
                  type="submit"
                  rightIcon={<LockIcon />}
                  disabled={!password || password !== confirmPassword}
                >
                    Update password
                </Button>
            </form>
        </div>
    );
}

export default ChangePassword;
