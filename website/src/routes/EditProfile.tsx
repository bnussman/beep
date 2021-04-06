import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { Button, TextInput } from '../components/Input';
import { Caption } from '../components/Typography';
import {gql, useMutation} from '@apollo/client';
import { AddProfilePictureMutation, EditAccountMutation } from '../generated/graphql';
import {Success} from '../components/Success';
import {Error} from '../components/Error';

const EditAccount = gql`
mutation EditAccount($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String) {
        editAccount (
            input: {
                first : $first,
                last: $last,
                email: $email,
                phone: $phone,
                venmo: $venmo,
                cashapp: $cashapp
            }
        ) {
        id
        name
        }
    }
`;

export const UploadPhoto = gql`
    mutation AddProfilePicture ($picture: Upload!){
        addProfilePicture (picture: $picture) {
            photoUrl
        }
    }
`;

function EditProfile() {
    const [edit, { data, loading, error }] = useMutation<EditAccountMutation>(EditAccount);
    const [upload, { loading: uploadLoading, error: uploadError }] = useMutation<AddProfilePictureMutation>(UploadPhoto);
    const user = useContext(UserContext);
    const [first, setFirst] = useState<string>(user.first);
    const [last, setLast] = useState<string>(user.last);
    const [email, setEmail] = useState<string>(user.email);
    const [phone, setPhone] = useState<string>(user.phone);
    const [venmo, setVenmo] = useState<string>(user.venmo);
    const [cashapp, setCashapp] = useState<string>(user.cashapp);
    const [photoUrl, setPhotoUrl] = useState<string>(user.photoUrl);

    useEffect(() => {
        if (first !== user.first) setFirst(user.first);
        if (last !== user.last) setLast(user.last);
        if (email !== user.email) setEmail(user.email);
        if (phone !== user.first) setPhone(user.phone);
        if (venmo !== user.venmo) setVenmo(user.venmo);
        if (photoUrl !== user.photoUrl) setPhotoUrl(user.photoUrl);
        if (cashapp !== user.cashapp) setCashapp(user.cashapp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    async function handleEdit(e: any) {
        e.preventDefault();
        await edit({ variables: {
            first: first,
            last: last,
            email: email,
            phone: phone,
            venmo: venmo,
            cashapp: cashapp
        }});
    }

    async function uploadPhoto(photo: any) {
       if (!photo) return;
       await upload({ variables: {
           picture: photo
       }});
    }

    if (!user) {
        return <Redirect to={{ pathname: "/login" }} />;
    }

    return (
        <div className="px-4 mx-auto lg:container dark:text-white">

            <div className="w-full px-5 pt-5 pb-10 mx-auto mb-4 text-gray-800 bg-white rounded-lg shadow-lg mt-14 dark:bg-gray-800 dark:text-white">
                <div className="w-full pt-1 pb-5">
                    <div className="w-20 h-20 mx-auto -mt-16 overflow-hidden rounded-full shadow-lg">
                        <label htmlFor="photo">
                            <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-full" />
                        </label>
                        <input
                            id="photo"
                            type="file"
                            onChange={(e) => uploadPhoto(e.target.files[0])}
                            hidden
                        /> 
                    </div>
                </div>
                <div className="w-full">
                    <p className="text-2xl font-bold text-center">{user.name}</p>
                    <p className="text-xs text-center text-gray-500">@{user?.username}</p>
                </div>
            </div>

            {error && <Error error={error} />}
            {data && <Success message="Profile Updated"/>}

            {uploadLoading && <p>Uploading new Photo...</p>}
            {uploadError && <p>{uploadError.message}</p>}


            <form onSubmit={(e) => handleEdit(e)}>
                <TextInput
                    className="mb-4"
                    id="username"
                    label="Username"
                    value={user?.username}
                    disabled
                />

                <TextInput
                    className="mb-4"
                    id="first"
                    label="First name"
                    value={first}
                    placeholder={first}
                    onChange={(value: any) => setFirst(value.target.value)}
                />

                <TextInput
                    className="mb-4"
                    id="last"
                    label="Last name"
                    value={last}
                    placeholder={last}
                    onChange={(value: any) => setLast(value.target.value)}
                />

                <TextInput
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    placeholder={email}
                    onChange={(value: any) => setEmail(value.target.value)}
                />
                <Caption className="mb-2">
                    {
                        user.isEmailVerified
                            ? user.isStudent
                                ? "Your email is verified and you are a student"
                                : "Your email is verified"
                                : "Your email is not verified"
                    }
                </Caption>

                <TextInput
                    className="mb-4"
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={phone}
                    placeholder={phone}
                    onChange={(value: any) => setPhone(value.target.value)}
                />

                <TextInput
                    className="mb-4"
                    id="venmo"
                    label="Venmo username"
                    value={venmo}
                    placeholder={venmo}
                    onChange={(value: any) => setVenmo(value.target.value)}
                />

                <TextInput
                    className="mb-4"
                    id="cashapp"
                    label="Cash App username"
                    value={cashapp}
                    placeholder={cashapp}
                    onChange={(value: any) => setCashapp(value.target.value)}
                />

                <Button raised>{loading ? "Updating profile..." : "Update profile"}</Button>
            </form>
        </div>
    );
}

export default EditProfile;
