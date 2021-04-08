import React, { FormEvent, useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { Link, Redirect, useHistory } from "react-router-dom";
import { TextInput } from '../components/Input';
import { gql, useMutation } from '@apollo/client';
import { AddProfilePictureMutation, SignUpMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { UploadPhoto } from './EditProfile';
import {client} from '../utils/Apollo';
import {GetUserData} from '../App';

const SignUpGraphQL = gql`
    mutation SignUp ($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String, $username: String!, $password: String!) {
        signup(input: {
            first: $first,
            last: $last,
            email: $email,
            phone: $phone,
            venmo: $venmo,
            cashapp: $cashapp,
            username: $username,
            password: $password,
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
    const [upload] = useMutation<AddProfilePictureMutation>(UploadPhoto);

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

    useEffect(() => {
        uploadPhoto();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    async function uploadPhoto() {
       if (!photo) return;

       await upload({ variables: {
           picture: photo
       }});
    }

    if (user) {
        return <Redirect to={{ pathname: "/" }} />;
    }

    return (
        <div className="px-4 mx-auto lg:container">
            {error && <Error error={error}/>}
            {photoError && <Error error={{ message: "Please pick a profile photo"}}/>}
            <form onSubmit={handleSignUp}>
                <TextInput
                    className="mb-4"
                    id="first"
                    label="First Name"
                    onChange={(value: any) => setFirst(value.target.value)}
                />
                <TextInput
                    className="mb-4"
                    id="last"
                    label="Last Name"
                    onChange={(value: any) => setLast(value.target.value)}
                />
                <TextInput
                    className="mb-4"
                    id="email"
                    label="Email"
                    onChange={(value: any) => setEmail(value.target.value)}
                />
                <TextInput
                    className="mb-4"
                    id="phone"
                    label="Phone Number"
                    onChange={(value: any) => setPhone(value.target.value)}
                />
                <TextInput
                    className="mb-4"
                    id="venmo"
                    label="Venmo Username"
                    onChange={(value: any) => setVenmo(value.target.value)}
                />
                <TextInput
                    className="mb-4"
                    id="cashapp"
                    label="Cash App Username"
                    onChange={(value: any) => setCashapp(value.target.value)}
                />
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
                {photo &&
                    <img className="w-24 h-24 mb-4 rounded-full" src={URL.createObjectURL(photo)} alt="profile"/>
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
                    className="px-4 py-2 mt-4 mb-4 font-bold text-white bg-gray-400 rounded shadow hover:bg-gray-700 focus:shadow-outline focus:outline-none"
                >
                    Choose Profile Photo
                </label>
                <br/>
                <br/>
                <button type="submit" className="px-4 py-2 mb-4 font-bold text-white bg-yellow-400 rounded shadow hover:bg-yellow-500 focus:shadow-outline focus:outline-none">
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>

            <div className="dark:text-white">
                By signing up, you agree to our
                <Link to="/terms" className="ml-2 mr-2 text-gray-700 dark:text-gray-400">Terms of Service</Link>
                and
                <Link to="/privacy" className="ml-2 mr-2 text-gray-700 dark:text-gray-400">Privacy Policy</Link>
            </div>
        </div>
    );
}

export default SignUp;
