import React, { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { gql, useMutation, useQuery } from '@apollo/client';
import { AddProfilePictureMutation, EditUserInput, EditUserMutation, GetUserDataQuery } from '../generated/graphql';
import { Error } from '../components/Error';
import { Alert, Avatar, Box, Button, Container, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { GetUserData, rootRoute } from '../App';
import { Card } from '../components/Card';
import { useForm } from "react-hook-form";
import { useValidationErrors } from '../utils/useValidationErrors';
import { Route } from '@tanstack/react-router';

const pick = (obj: any, keys: string[]) => Object.fromEntries(
  keys
  .filter(key => key in obj)
  .map(key => [key, obj[key]])
);

const EditAccount = gql`
  mutation EditAccount($data: EditUserInput!) {
    editUser (data: $data) {
      id
      first
      last
      email
      phone
      venmo
      cashapp
    }
  }
`;

export const UploadPhoto = gql`
  mutation AddProfilePicture ($picture: Upload!){
    addProfilePicture (picture: $picture) {
      id
      photo
    }
  }
`;

export const editProfileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile/edit',
  component: EditProfile,
})

export function EditProfile() {
  const [edit, { error, loading }] = useMutation<EditUserMutation>(EditAccount);
  const [upload, { loading: uploadLoading, error: uploadError }] = useMutation<AddProfilePictureMutation>(UploadPhoto, {
   context: {
      headers: {
        'apollo-require-preflight': true,
      },
    },
  });
  const { data: userData } = useQuery<GetUserDataQuery>(GetUserData);
  const toast = useToast();

  const user = userData?.getUser;

  const validationErrors = useValidationErrors<EditUserInput>(error);

  const defaultValues = pick(user, ['first', 'last', 'email', 'phone', 'venmo', 'cashapp']);

  const { handleSubmit, register, reset, formState: { errors, isValid, isDirty } } = useForm<EditUserInput>({
     defaultValues
  });

  const onSubmit = handleSubmit(async (variables) => {
    const { data } = await edit({ variables: { data: variables } });

    if (data) {
      toast({ status: 'success', title: "Success", description: "Successfully updated profile" });
    }
  });

  async function uploadPhoto(picture: File | undefined) {
    if (!picture) return;
    upload({ variables: { picture } })
      .then(() => {
        toast({ status: 'success', title: "Success", description: "Successfully updated profile picture" });
      });
  }

  useEffect(() => {
    reset(pick(user, ['first', 'last', 'email', 'phone', 'venmo', 'cashapp']));
  }, [user]);

  if (!user) {
    return <Navigate to={{ pathname: "/login" }} />;
  }

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        {error && !validationErrors ? <Error error={error} /> : null}
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
              <FormLabel cursor="pointer" htmlFor="photo">
                <Avatar size="xl" src={user?.photo || undefined} />
              </FormLabel>
              <Input
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
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={user?.username}
                isDisabled
              />
            </FormControl>
            <FormControl isInvalid={Boolean(errors.first) || Boolean(validationErrors?.first)}>
              <FormLabel>First Name</FormLabel>
              <Input
                {...register('first', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.first && errors.first.message}
                {validationErrors?.first && validationErrors?.first[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.last) || Boolean(validationErrors?.last)}>
              <FormLabel>Last Name</FormLabel>
              <Input
                {...register('last', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.last && errors.last.message}
                {validationErrors?.last && validationErrors?.last[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.email) || Boolean(validationErrors?.email)}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                {...register('email', {
                  required: 'This is required',
                })}
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
              <FormErrorMessage>
                {errors.email && errors.email.message}
                {validationErrors?.email && validationErrors?.email[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.phone) || Boolean(validationErrors?.phone)}>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                {...register('phone', {
                  required: 'This is required',
                })}
              />
              <FormErrorMessage>
                {errors.phone && errors.phone.message}
                {validationErrors?.phone && validationErrors?.phone[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.venmo) || Boolean(validationErrors?.venmo)}>
              <FormLabel>Venmo</FormLabel>
              <Input
                {...register('venmo')}
              />
              <FormErrorMessage>
                {errors.venmo && errors.venmo.message}
                {validationErrors?.venmo && validationErrors?.venmo[0]}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.cashapp) || Boolean(validationErrors?.cashapp)}>
              <FormLabel>Cash App</FormLabel>
              <Input
                {...register('cashapp')}
              />
              <FormErrorMessage>
                {errors.cashapp && errors.cashapp.message}
                {validationErrors?.cashapp && validationErrors?.cashapp[0]}
              </FormErrorMessage>
            </FormControl>
            <Flex justifyContent="flex-end">
              <Button type="submit" colorScheme='blue' isLoading={loading} isDisabled={!isValid || !isDirty}>
                Save Profile
              </Button>
            </Flex>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
