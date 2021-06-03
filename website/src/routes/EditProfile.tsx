import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Redirect } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { AddProfilePictureMutation, EditAccountMutation } from '../generated/graphql';
import { Success } from '../components/Success';
import { Error } from '../components/Error';
import { Alert, Avatar, Box, Button, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Spinner, Text } from '@chakra-ui/react';
import { SpinnerIcon } from '@chakra-ui/icons';

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
  const [first, setFirst] = useState<string>(user?.first);
  const [last, setLast] = useState<string>(user?.last);
  const [email, setEmail] = useState<string>(user?.email);
  const [phone, setPhone] = useState<string>(user?.phone);
  const [venmo, setVenmo] = useState<string>(user?.venmo);
  const [cashapp, setCashapp] = useState<string>(user?.cashapp);
  const [photoUrl, setPhotoUrl] = useState<string>(user?.photoUrl);

  useEffect(() => {
    if (first !== user?.first) setFirst(user.first);
    if (last !== user?.last) setLast(user.last);
    if (email !== user?.email) setEmail(user.email);
    if (phone !== user?.first) setPhone(user.phone);
    if (venmo !== user?.venmo) setVenmo(user.venmo);
    if (photoUrl !== user?.photoUrl) setPhotoUrl(user.photoUrl);
    if (cashapp !== user?.cashapp) setCashapp(user.cashapp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleEdit(e: any) {
    e.preventDefault();
    await edit({
      variables: {
        first: first,
        last: last,
        email: email,
        phone: phone,
        venmo: venmo,
        cashapp: cashapp
      }
    });
  }

  async function uploadPhoto(photo: any) {
    if (!photo) return;
    await upload({
      variables: {
        picture: photo
      }
    });
  }

  if (!user) {
    return <Redirect to={{ pathname: "/login" }} />;
  }

  return (
    <Box>
      {error && <Error error={error} />}
      {data && <Success message="Profile Updated" />}

      {uploadLoading &&
        <Alert status="info" mb={2}>
          <Spinner size="xs" mr={2} />
          Uploading Profile Photo
        </Alert>
      }
      {uploadError && <Error error={uploadError.message}/>}

      <Box mb={6}>
          <Flex align="center">
              <Box>
                  <label htmlFor="photo">
                      <Avatar size="xl" src={photoUrl} />
                  </label>
                  <input
                      id="photo"
                      type="file"
                      onChange={(e) => uploadPhoto(e.target.files[0])}
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
          <FormControl id="email">
              <FormLabel>Username</FormLabel>
              <Input
                  id="username"
                  label="Username"
                  value={user?.username}
                  disabled
              />
          </FormControl>
          <FormControl mt={2}>
              <FormLabel>First Name</FormLabel>
              <Input
                  id="first"
                  label="First name"
                  value={first}
                  placeholder={first}
                  onChange={(value: any) => setFirst(value.target.value)}
              />
          </FormControl>
          <FormControl mt={2}>
              <FormLabel>Last Name</FormLabel>
              <Input
                  value={last}
                  placeholder={last}
                  onChange={(value: any) => setLast(value.target.value)}
              />
          </FormControl>
          <FormControl mt={2}>
              <FormLabel>Email</FormLabel>
              <Input
                  type="email"
                  value={email}
                  placeholder={email}
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
          <FormControl mt={2}>
              <FormLabel>Phone</FormLabel>
              <Input
                  type="tel"
                  value={phone}
                  placeholder={phone}
                  onChange={(value: any) => setPhone(value.target.value)}
              />
          </FormControl>
          <FormControl mt={2}>
              <FormLabel>Venmo</FormLabel>
              <Input
                  value={venmo || ''}
                  placeholder={venmo}
                  onChange={(value: any) => setVenmo(value.target.value)}
              />
          </FormControl>
          <FormControl mt={2}>
              <FormLabel>Cash App</FormLabel>
              <Input
                  value={cashapp || ''}
                  placeholder={cashapp}
                  onChange={(value: any) => setCashapp(value.target.value)}
              />
          </FormControl>
        <Button mt={4} type="submit" isLoading={loading}>Update profile</Button>
      </form>
    </Box>
  );
}

export default EditProfile;
