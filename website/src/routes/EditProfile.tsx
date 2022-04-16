import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import { gql, useMutation, useQuery } from '@apollo/client';
import { AddProfilePictureMutation, EditAccountMutation, GetUserDataQuery } from '../generated/graphql';
import { Error } from '../components/Error';
import { Alert, Avatar, Box, Button, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { GetUserData } from '../App';
import { Card } from '../components/Card';

const EditAccount = gql`
  mutation EditAccount($first: String!, $last: String!, $email: String!, $phone: String!, $venmo: String, $cashapp: String) {
    editAccount (input: { first: $first, last: $last, email: $email, phone: $phone, venmo: $venmo, cashapp: $cashapp }) {
      id
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
  const { data: userData } = useQuery<GetUserDataQuery>(GetUserData);
  const toast = useToast();

  const user = userData?.getUser;
  
  const [first, setFirst] = useState<string | undefined>(user?.first);
  const [last, setLast] = useState<string | undefined>(user?.last);
  const [email, setEmail] = useState<string | undefined>(user?.email);
  const [phone, setPhone] = useState<string | undefined>(user?.phone);
  const [venmo, setVenmo] = useState<string | null | undefined>(user?.venmo);
  const [cashapp, setCashapp] = useState<string | null | undefined>(user?.cashapp);
  const [photoUrl, setPhotoUrl] = useState<string | null | undefined>(user?.photoUrl);

  useEffect(() => {
    if (user) {
      if (first !== user?.first) setFirst(user.first);
      if (last !== user?.last) setLast(user.last);
      if (email !== user?.email) setEmail(user.email);
      if (phone !== user?.first) setPhone(user.phone);
      if (venmo !== user?.venmo) setVenmo(user.venmo);
      if (photoUrl !== user?.photoUrl) setPhotoUrl(user.photoUrl);
      if (cashapp !== user?.cashapp) setCashapp(user.cashapp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleEdit(e: any) {
    e.preventDefault();
    edit({ variables: { first, last, email, phone, venmo, cashapp } })
      .then(() => {
        toast({ status: 'success', title: "Success", description: "Successfully updated profile" });
      })
  }

  async function uploadPhoto(photo: File | undefined) {
    if (!photo) return;
    await upload({
      variables: {
        picture: photo
      }
    });
  }

  if (!user) {
    return <Navigate to={{ pathname: "/login" }} />;
  }

  return (
    <Card>
      {error && <Error error={error} />}
      {uploadLoading &&
        <Alert status="info" mb={2}>
          <Spinner size="xs" mr={2} />
          Uploading Profile Photo
        </Alert>
      }
      {uploadError && <Error error={uploadError} />}
      <Box mb={6}>
        <Flex align="center">
          <Box>
            <label htmlFor="photo">
              <Avatar size="xl" src={photoUrl || undefined} />
            </label>
            <input
              id="photo"
              type="file"
              onChange={(e) => uploadPhoto(e.target.files?.[0])}
              hidden
            />
          </Box>
          <Box ml="4">
            <Heading>{user.name}</Heading>
            <Text>@{user?.username}</Text>
          </Box>
        </Flex>
      </Box>
      <form onSubmit={(e) => handleEdit(e)}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Username</FormLabel>
            <Input
              id="username"
              label="Username"
              value={user?.username}
              disabled
            />
          </FormControl>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input
              id="first"
              label="First name"
              value={first}
              onChange={(value: any) => setFirst(value.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input
              value={last}
              onChange={(value: any) => setLast(value.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(value: any) => setEmail(value.target.value)}
            />
            <FormHelperText>
              {
                user.isEmailVerified
                  ? user.isStudent
                    ? "Your email is verified and you are a student"
                    : "Your email is verified"
                  : "Your email is not verified"
              }
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input
              type="tel"
              value={phone}
              onChange={(value: any) => setPhone(value.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Venmo</FormLabel>
            <Input
              value={venmo || ''}
              onChange={(value: any) => setVenmo(value.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Cash App</FormLabel>
            <Input
              value={cashapp || ''}
              onChange={(value: any) => setCashapp(value.target.value)}
            />
          </FormControl>
          <Button type="submit" isLoading={loading}>Update profile</Button>
        </Stack>
      </form>
    </Card>
  );
}

export default EditProfile;
