import React, { useContext } from 'react'
import { UserContext } from '../UserContext';
import UserProfile from '../components/UserProfile';
import {Redirect} from 'react-router-dom';
import { Heading } from '@chakra-ui/react';

function Profile(props) {
    const user = useContext(UserContext);

    if (!user) {
        return <Redirect to={{ pathname: "/login" }} />;
    }

    return (
        <div>
            <Heading>My profile</Heading>
            <UserProfile user={user} />
        </div>
    );
}

export default Profile;
