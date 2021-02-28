import React, { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect, Link } from "react-router-dom";
import socket from "../utils/Socket";
import { TextInput } from '../components/Input';
import { Caption } from '../components/Typography';
import {gql, useMutation} from '@apollo/client';
import {LoginMutation} from '../generated/graphql';

const LoginGraphQL = gql`
    mutation Login($username: String!, $password: String!) {
        login(input: {username: $username, password: $password}) {
            user {
                id
                first
                last
                username
                email
                phone
                venmo
                isBeeping
                isEmailVerified
                isStudent
                groupRate
                singlesRate
                capacity
                masksRequired
                queueSize
                role
                photoUrl
                name
            }
            tokens {
                id
                tokenid
            }
        }
    }
`;

function Login() {
    const { user, setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, { loading, error }] = useMutation<LoginMutation>(LoginGraphQL);

    async function handleLogin(e: FormEvent): Promise<void> {

        e.preventDefault();

        try {
            const result = await login({ variables: {
                username: username,
                password: password
            }});

            if (result) {
                setUser(result.data.login);
                localStorage.setItem('user', JSON.stringify(result.data.login));
                socket.emit("getUser", result.data.login.tokens.id);
            }
        }
        catch (error) {

        }
    }

    if (user) {
        return <Redirect to={{ pathname: "/" }} />;
    }

    return (
        <div className="lg:container px-4 mx-auto">
            {error && <p>{error.message}</p>}
            <form onSubmit={handleLogin}>
                <TextInput
                    className="mb-4"
                    id="username"
                    label="Username"
                    onChange={(value: any) => setUsername(value.target.value)}
                />
                <TextInput
                    className="mb-4"
                    id="password"
                    type="password"
                    label="Password"
                    onChange={(value: any) => setPassword(value.target.value)}
                />
                <button type="submit" className="mb-4 shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <Link to={"/password/forgot"} className="text-gray-500">Forgot Password</Link>
            <Caption className="mt-4">Currently, the option to sign up is only avalible in our app (coming soon)</Caption>
        </div>
    );
}

export default Login;
