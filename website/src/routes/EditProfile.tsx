import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { Button, TextInput } from '../components/Input';
import { Caption } from '../components/Typography';
import {gql, useMutation} from '@apollo/client';
import { EditAccountMutation } from '../generated/graphql';

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

function EditProfile() {
    const { user, setUser } = useContext(UserContext);
    const [edit, { data, loading, error }] = useMutation<EditAccountMutation>(EditAccount);
    const [first, setFirst] = useState<string | undefined>(user?.user.first);
    const [last, setLast] = useState<string | undefined>(user?.user.last);
    const [email, setEmail] = useState<string | undefined>(user?.user.email);
    const [phone, setPhone] = useState<string | undefined>(user?.user.phone);
    const [venmo, setVenmo] = useState<string | undefined>(user?.user.venmo);

    useEffect(() => {
        if (first !== user?.user.first) setFirst(user?.user.first);
        if (last !== user?.user.last) setLast(user?.user.last);
        if (email !== user?.user.email) setEmail(user?.user.email);
        if (phone !== user?.user.first) setPhone(user?.user.phone);
        if (venmo !== user?.user.venmo) setVenmo(user?.user.venmo);
        // eslint-disable-next-line
    }, [user]);

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
                const tempUser = user;
                //update values of user
                tempUser.user.first = first;
                tempUser.user.last = last;
                tempUser.user.email = email;
                tempUser.user.phone = phone;
                tempUser.user.venmo = venmo;

                //if email was changed, make sure the context knows the user is no longer verified
                if (email !== user.user.email) {
                    tempUser.user.isEmailVerified = false;
                    tempUser.user.isStudent = false;
                }
                //update the context
                setUser(tempUser);
                //update localStorage
                localStorage.setItem("user", JSON.stringify(tempUser));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

        if (!user) {
            return <Redirect to={{ pathname: "/login" }} />;
        }

        return (
            <div className="px-4 mx-auto lg:container">
                {error && error.message}
                {data && <p>Success</p>}

                <form onSubmit={(e) => handleEdit(e)}>
                    <TextInput
                        className="mb-4"
                        id="username"
                        label="Username"
                        value={user.user.username}
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
                            user.user.isEmailVerified
                            ? user.user.isStudent
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
