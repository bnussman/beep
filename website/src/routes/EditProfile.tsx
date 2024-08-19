import React from 'react';
import { Error } from '../components/Error';
import { Alert, Avatar, Box, Button, Container, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { Card } from '../components/Card';
import { useForm } from "react-hook-form";
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../utils/router';
import { RouterInput, trpc } from '../utils/trpc';

type Values = RouterInput['user']['edit'];

export const editProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/edit',
  component: EditProfile,
})

export function EditProfile() {
  const { mutateAsync: edit, error, isPending } = trpc.user.edit.useMutation();
  const { mutateAsync: uploadPicture, isPending: isUploadPending, error: uploadError } = trpc.user.updatePicture.useMutation();

  const { data: user } = trpc.user.me.useQuery(undefined, { enabled: false });
  const toast = useToast();

  const validationErrors = error?.data?.zodError?.fieldErrors;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm<Values>({
     defaultValues: {
       first: user?.first,
       last: user?.last,
       email: user?.email,
       phone: user?.phone,
       venmo: user?.venmo,
       cashapp: user?.cashapp,
     },
     values: user ? {
       first: user.first,
       last: user.last,
       email: user.email,
       phone: user.phone,
       venmo: user.venmo,
       cashapp: user.cashapp,
     } : undefined,
  });

  const onSubmit = handleSubmit(async (variables) => {
    await edit(variables);

    toast({
      status: 'success',
      title: "Success",
      description: "Successfully updated profile"
    });
  });

  const uploadPhoto = async (picture: File | undefined) => {
    if (!picture) {
      return toast({
        status: "error",
        title: "Error",
        description: "No file found when trying to start upload."
      });
    };

    const formData = new FormData();

    formData.set('photo', picture);

    try {
      await uploadPicture(formData);

      toast({
        status: 'success',
        title: "Success",
        description:
        "Successfully updated profile picture"
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: uploadError?.message,
      });
    }
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxW="container.sm" p={[0]}>
      <Card>
        {error && !validationErrors && <Error>{error.message}</Error>}
        {isUploadPending &&
          <Alert status="info" mb={2}>
            <Spinner size="xs" mr={2} />
            Uploading Profile Photo
          </Alert>
        }
        {uploadError && <Error>{uploadError.message}</Error>}
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
              <Heading>{user.first} {user.last}</Heading>
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
              <Button type="submit" colorScheme='blue' isLoading={isPending} isDisabled={!isValid || !isDirty}>
                Save Profile
              </Button>
            </Flex>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
