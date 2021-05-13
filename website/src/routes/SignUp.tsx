import React, { FormEvent, useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Link, Redirect, useHistory } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { SignUpMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import {client} from '../utils/Apollo';
import {GetUserData} from '../App';
import { Avatar, Button, Input } from '@chakra-ui/react';

const SignUpGraphQL = gql`
mutation SignUp ($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String, $username: String!, $password: String!, $picture: Upload!) {
        signup(input: {
            first: $first,
            last: $last,
            email: $email,
            phone: $phone,
            venmo: $venmo,
            cashapp: $cashapp,
            username: $username,
            password: $password,
            picture: $picture
        }) {
            tokens {
                id
                tokenid
            }
        }
    }
`;

//let photo: File;

function SignUp() {
    const history = useHistory();
    const user = useContext(UserContext);
    const [first, setFirst] = useState<string>();
    const [last, setLast] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [venmo, setVenmo] = useState<string>();
    const [cashapp, setCashapp] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [photo, setPhoto] = useState();
    const [photoError, setPhotoError] = useState<boolean>(false);
    const [signup, { loading, error }] = useMutation<SignUpMutation>(SignUpGraphQL);

    async function handleSignUp(e: FormEvent): Promise<void> {
        e.preventDefault();

        if (!photo) {
            setPhotoError(true)
            return;
        }

        setPhotoError(false);

        try {
            const result = await signup({ variables: {
                first: first,
                last: last,
                email: email,
                phone: phone,
                venmo: venmo,
                cashapp: cashapp,
                username: username, 
                password: password,
                picture: photo
            }});

            if (result) {
                localStorage.setItem('user', JSON.stringify(result.data.signup));
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
        <div>
            {error && <Error error={error}/>}
            {photoError && <Error error={{ message: "Please pick a profile photo"}}/>}
            <form onSubmit={handleSignUp}>
                <Input
                    id="first"
                    label="First Name"
                    onChange={(value: any) => setFirst(value.target.value)}
                />
                <Input
                    id="last"
                    label="Last Name"
                    onChange={(value: any) => setLast(value.target.value)}
                />
                <Input
                    id="email"
                    label="Email"
                    onChange={(value: any) => setEmail(value.target.value)}
                />
                <Input
                    id="phone"
                    label="Phone Number"
                    onChange={(value: any) => setPhone(value.target.value)}
                />
                <Input
                    id="venmo"
                    label="Venmo Username"
                    onChange={(value: any) => setVenmo(value.target.value)}
                />
                <Input
                    id="cashapp"
                    label="Cash App Username"
                    onChange={(value: any) => setCashapp(value.target.value)}
                />
                <Input
                    id="username"
                    label="Username"
                    onChange={(value: any) => setUsername(value.target.value)}
                />
                <Input
                    id="password"
                    type="password"
                    label="Password"
                    onChange={(value: any) => setPassword(value.target.value)}
                />
                {photo &&
                    <Avatar src={URL.createObjectURL(photo)} name={first} />
                }
                <input
                    hidden
                    id="photo"
                    type="file"
                    onChange={(e) => {
                        //@ts-ignore
                        setPhoto(e.target.files[0]);
                        console.log(e.target.files[0]);
                    }}
                /> 
                <label
                    htmlFor="photo"
                >
                    Choose Profile Photo
                </label>
                <Button type="submit">
                    {loading ? "Signing Up..." : "Sign Up"}
                </Button>
            </form>

            <div>
                By signing up, you agree to our
                <Link to="/terms">Terms of Service</Link>
                and
                <Link to="/privacy">Privacy Policy</Link>
            </div>
        </div>
    );
}

export default SignUp;
