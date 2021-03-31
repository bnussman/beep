import { FormEvent, useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { TextInput } from '../components/Input';
import { gql, useMutation } from '@apollo/client';
import { AddProfilePictureMutation, SignUpMutation } from '../generated/graphql';
import { Error } from '../components/Error';
import { UploadPhoto } from './EditProfile';

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
            user {
                id
                first
                last
                username
                email
                phone
                venmo
                cashapp
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

let photo: File;

function SignUp() {
    const userContext = useContext(UserContext);
    const [first, setFirst] = useState<string>();
    const [last, setLast] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [venmo, setVenmo] = useState<string>();
    const [cashapp, setCashapp] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [signup, { loading, error }] = useMutation<SignUpMutation>(SignUpGraphQL);
    const [upload] = useMutation<AddProfilePictureMutation>(UploadPhoto);

    async function handleSignUp(e: FormEvent): Promise<void> {

        e.preventDefault();

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
                userContext.setUser(result.data.signup);
                localStorage.setItem('user', JSON.stringify(result.data.signup));
            }
        }
        catch (error) {

        }
    }

    useEffect(() => {
        uploadPhoto();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userContext.user]);

    async function uploadPhoto() {
       if (!photo) return;

       const data = await upload({ variables: {
           picture: photo
       }});

       console.log(userContext);

       //make a copy of the current user
       const tempAuth = userContext.user;

       //update the tempUser with the new data
       tempAuth.user.photoUrl = data.data?.addProfilePicture.photoUrl;

       //update the context
       userContext.setUser(tempAuth);

       //put the tempUser back into storage
       localStorage.setItem("user", JSON.stringify(tempAuth));
    }

    if (userContext.user) {
        return <Redirect to={{ pathname: "/" }} />;
    }

    return (
        <div className="px-4 mx-auto lg:container">
            {error && <Error error={error}/>}
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
                <input
                    id="photo"
                    type="file"
                    onChange={(e) => {
                        photo = e.target.files[0]
                    }}
                /> 
                <button type="submit" className="px-4 py-2 mb-4 font-bold text-white bg-yellow-400 rounded shadow hover:bg-yellow-400 focus:shadow-outline focus:outline-none">
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}

export default SignUp;
