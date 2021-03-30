import React, { useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { Button, TextInput } from '../components/Input';
import { Caption } from '../components/Typography';
import {gql, useMutation} from '@apollo/client';
import { AddProfilePictureMutation, EditAccountMutation } from '../generated/graphql';
import {Success} from '../components/Success';
import {Error} from '../components/Error';

const EditAccount = gql`
    mutation EditAccount($first: String, $last: String, $email: String, $phone: String, $venmo: String) {
        editAccount (
            input: {
                first : $first,
                last: $last,
                email: $email,
                phone: $phone,
                venmo: $venmo
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
    const userContext = React.useContext(UserContext);
    const [first, setFirst] = useState<string | undefined>(userContext.user?.user?.first);
    const [last, setLast] = useState<string | undefined>(userContext.user?.user?.last);
    const [email, setEmail] = useState<string | undefined>(userContext.user?.user?.email);
    const [phone, setPhone] = useState<string | undefined>(userContext.user?.user?.phone);
    const [venmo, setVenmo] = useState<string | undefined>(userContext.user?.user?.venmo);
    const [photoUrl, setPhotoUrl] = useState<string | undefined>(userContext.user?.user?.photoUrl);

    useEffect(() => {
        if (first !== userContext.user?.user?.first) setFirst(userContext.user?.user?.first);
        if (last !== userContext.user?.user?.last) setLast(userContext.user?.user?.last);
        if (email !== userContext.user?.user?.email) setEmail(userContext.user?.user?.email);
        if (phone !== userContext.user?.user?.first) setPhone(userContext.user?.user?.phone);
        if (venmo !== userContext.user?.user?.venmo) setVenmo(userContext.user?.user?.venmo);
        if (photoUrl !== userContext.user?.user?.photoUrl) setPhotoUrl(userContext.user?.user?.photoUrl);
        // eslint-disable-next-line
    }, [userContext]);

    async function handleEdit(e: any) {
        e.preventDefault();

        try {
            const result = await edit({ variables: {
                first: first,
                last: last,
                email: email,
                phone: phone,
                venmo: venmo
            }});

            if (result) {
                //make a temporary user object
                const tempUser = userContext.user;
                //update values of user
                tempUser.user.first = first;
                tempUser.user.last = last;
                tempUser.user.email = email;
                tempUser.user.phone = phone;
                tempUser.user.venmo = venmo;

                //if email was changed, make sure the context knows the user is no longer verified
                if (email !== userContext.user.user.email) {
                    console.log("EMAIL CHANGED");
                    tempUser.user.isEmailVerified = false;
                    tempUser.user.isStudent = false;
                }
                //update the context
                userContext.setUser(tempUser);
                //update localStorage
                localStorage.setItem("user", JSON.stringify(tempUser));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async function uploadPhoto(photo: any) {
       if (!photo) return;
       const data = await upload({ variables: {
           picture: photo
       }});

       if (data.data?.addProfilePicture.photoUrl && userContext?.user) {
           //make a copy of the current user
           const tempAuth = userContext.user;

           //update the tempUser with the new data
           tempAuth.user.photoUrl = data.data?.addProfilePicture.photoUrl;

           //update the context
           userContext.setUser(tempAuth);

           //put the tempUser back into storage
           localStorage.setItem("user", JSON.stringify(tempAuth));
       }
    }

    if (!userContext.user) {
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
                    <p className="text-2xl font-bold text-center">{userContext?.user?.user?.name}</p>
                    <p className="text-xs text-center text-gray-500">@{userContext?.user?.user?.username}</p>
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
                    value={userContext?.user?.user?.username}
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
                        userContext?.user?.user?.isEmailVerified
                            ? userContext?.user?.user?.isStudent
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

                <Button raised>{loading ? "Updating profile..." : "Update profile"}</Button>
            </form>
        </div>
    );
}

export default EditProfile;
