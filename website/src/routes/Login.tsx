import { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect, Link, useHistory } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { LoginMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { GetUserData } from '../App';
import {client} from '../utils/Apollo';
import { Box, Button, Input } from "@chakra-ui/react"

const LoginGraphQL = gql`
    mutation Login($username: String!, $password: String!) {
        login(input: {username: $username, password: $password}) {
            tokens {
                id
                tokenid
            }
        }
    }
`;

function Login() {
    const history = useHistory();
    const user = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, { loading, error }] = useMutation<LoginMutation>(LoginGraphQL);

    async function handleLogin(e: FormEvent) {

        e.preventDefault();

        try {
            const result = await login({
                variables: {
                    username: username,
                    password: password
                },
            });


            if (result) {
                localStorage.setItem('user', JSON.stringify(result.data.login));
                await client.resetStore();
                await client.query({ query: GetUserData });
                //await client.query({ query: GetUserData, });
                history.push('/')
            }

        }
        catch (error) {

        }
    }

    if (user) {
        return <Redirect to={{ pathname: "/" }} />;
    }

    return (
        <Box>
            {error && <Error error={error}/>}
            <form onSubmit={handleLogin}>
                <Input
                    placeholder="Username"
                    onChange={(value: any) => setUsername(value.target.value)}
                />
                <Input
                    placeholder="Password"
                    onChange={(value: any) => setPassword(value.target.value)}
                />
                <Button
                    mt={4}
                    isLoading={loading}
                    type="submit"
                >
                    Login
                </Button>
            </form>

            <div className="mb-4">
                <Link to="/password/forgot" className="text-gray-500">Forgot Password</Link>
            </div>

            <div>
                <Link to="/signup" className="text-gray-500">Sign Up</Link>
            </div>
        </Box>
    );
}

export default Login;
