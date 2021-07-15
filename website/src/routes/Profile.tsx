import React, { useContext } from 'react'
import { UserContext } from '../UserContext';
import UserProfile from '../components/UserProfile';
import { Redirect } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';

function Profile() {
  const user = useContext(UserContext);

  if (!user) {
    return <Redirect to={{ pathname: "/login" }} />;
  }

  return (
    <Box>
      <Heading>My profile</Heading>
      <UserProfile user={user} />
    </Box>
  );
}

export default Profile;
