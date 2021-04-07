import React, { useContext } from 'react'
import { UserContext } from '../UserContext';
import UserProfile from '../components/UserProfile';
import { Heading3 } from '../components/Typography';
import {Redirect} from 'react-router-dom';

function Profile(props) {
    const user = useContext(UserContext);

    if (!user) {
        return <Redirect to={{ pathname: "/login" }} />;
    }

    return (
        <div className="container mx-auto">
            <Heading3>My profile</Heading3>
            <UserProfile user={user} />
        </div>
    );
}

export default Profile;
