import { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect, Link, useHistory } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { LoginMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { GetUserData } from '../App';
import {client} from '../utils/Apollo';
import { Box, Button, Input, Container, Stack, FormControl, FormLabel, Heading, Flex, Checkbox } from "@chakra-ui/react"

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
        <Container maxW="container.lg">
            <Flex
                minH={'80vh'}
                align={'center'}
                justify={'center'}
            >
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Sign in</Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        boxShadow={'lg'}
                        p={8}>
                        <form onSubmit={handleLogin}>
                        <Stack spacing={4}>
                            {error && <Error error={error}/>}
                            <FormControl id="email">
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="email"
                                    onChange={(value: any) => setUsername(value.target.value)}
                                />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    onChange={(value: any) => setPassword(value.target.value)}
                                />
                            </FormControl>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    <Checkbox>Remember me</Checkbox>
                                    <Link to='password/forgot' color={'blue.400'}>Forgot password?</Link>
                                </Stack>
                                <Button
                                    type="submit"
                                    onClick={handleLogin}
                                    isLoading={loading}
                                    bg={'yellow.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'yellow.500',
                                    }}>
                                    Sign in
                                </Button>
                            </Stack>
                        </Stack>
                        </form>
                    </Box>
                </Stack>
            </Flex>
        </Container>
    );
}

export default Login;
