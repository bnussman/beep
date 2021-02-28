import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { config } from '../utils/config';
import { Button, TextInput } from '../components/Input';
import APIResultBanner from '../components/APIResultBanner';
import {gql, useMutation} from '@apollo/client';
import {ChangePasswordMutation} from '../generated/graphql';

const ChangePasswordGraphQL = gql`
    mutation ChangePassword($password: String!) {
        changePassword (password: $password)
    }
`;
function ChangePassword() {
    const [changePassword, { data, loading, error }] = useMutation<ChangePasswordMutation>(ChangePasswordGraphQL);
    const { user } = useContext(UserContext);
    const [status, setStatus]: [any, any] = useState();
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    if (!user) {
        return <Redirect to={{ pathname: "/login" }} />;
    }

    async function handleEdit(e: any): Promise<void> {
        e.preventDefault();

        if (password !== password2) {
            return setStatus({
                status: "error",
                message: "Your passwords do not match."
            });
        }

        if (!password || !password2) {
            return setStatus({
                status: "error",
                message: "Please enter a new password."
            });
        }

        try {
            const response = await changePassword({ variables: {
                password: password
            }});
        }
        catch(error) {
            console.error(error);
        }
    }

    return (
        <div className="lg:container px-4 mx-auto">
            {data?.changePassword && <p>Success</p>}
            {error && error}
            {loading && <p>Loading</p>}
            {status && <APIResultBanner response={status} setResponse={setStatus}/>}
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
