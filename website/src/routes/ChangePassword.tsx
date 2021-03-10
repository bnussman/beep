import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { Button, TextInput } from '../components/Input';
import { Error } from '../components/Error';
import {gql, useMutation} from '@apollo/client';
import {ChangePasswordMutation} from '../generated/graphql';
import {Success} from '../components/Success';

const ChangePasswordGraphQL = gql`
    mutation ChangePassword($password: String!) {
        changePassword (password: $password)
    }
`;

function ChangePassword() {
    const [changePassword, { data, loading, error }] = useMutation<ChangePasswordMutation>(ChangePasswordGraphQL);
    const { user } = useContext(UserContext);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    if (!user) {
        return <Redirect to={{ pathname: "/login" }} />;
    }

    async function handleEdit(e: any): Promise<void> {
        e.preventDefault();

        try {
            await changePassword({ variables: {
                password: password
            }});
        }
        catch(error) {
            console.error(error);
        }
    }

    return (
        <div className="px-4 mx-auto lg:container">
            {data?.changePassword && <Success message="Successfully changed your password"/>}
            {error && <Error error={error} />}
            {loading && <p>Loading</p>}
            <form onSubmit={handleEdit}>
                <TextInput
                    className="mb-4"
                    id="password"
                    label="Password"
                    type="password"
                    onChange={(value: any) => setPassword(value.target.value)}
                />
                <TextInput
                    className="mb-4"
                    id="password2"
                    label="Repeat password"
                    type="password"
                    onChange={(value: any) => setPassword2(value.target.value)}
                />
                <Button raised type="submit">Update password</Button>
            </form>
        </div>
    );
}

export default ChangePassword;
