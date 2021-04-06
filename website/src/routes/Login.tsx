import { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect, Link, useHistory } from "react-router-dom";
import { TextInput } from '../components/Input';
import { gql, useMutation } from '@apollo/client';
import { LoginMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { client, GetUserData } from '../App';

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
            await client.resetStore();
            const result = await login({
                variables: {
                    username: username,
                    password: password
                }
            });

            if (result) {
                localStorage.setItem('user', JSON.stringify(result.data.login));
                await client.query({ query: GetUserData, fetchPolicy: "network-only" });
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
        <div className="px-4 mx-auto lg:container">
            {error && <Error error={error}/>}
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
                <button type="submit" className="px-4 py-2 mb-4 font-bold text-white bg-yellow-400 rounded shadow hover:bg-yellow-400 focus:shadow-outline focus:outline-none">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="mb-4">
                <Link to="/password/forgot" className="text-gray-500">Forgot Password</Link>
            </div>

            <div>
                <Link to="/signup" className="text-gray-500">Sign Up</Link>
            </div>
        </div>
    );
}

export default Login;
