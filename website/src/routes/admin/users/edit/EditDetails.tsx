import React from "react";
import { Loading } from "../../../../components/Loading";
import { Box, Button, Checkbox, FormControl, FormLabel, Input, useToast, FormErrorMessage, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from '@apollo/client';
import { EditUserMutation, EditUserMutationVariables, GetEditableUserQuery } from '../../../../generated/graphql';
import { Error } from '../../../../components/Error';
import { useValidationErrors } from "../../../../utils/useValidationErrors";
import { useForm } from "react-hook-form";

const GetEditableUser = gql`
  query GetEditableUser($id: String!) {
    getUser(id: $id) {
      first
      last
      isBeeping
      isStudent
      isEmailVerified
      role
      venmo
      singlesRate
      groupRate
      capacity
      masksRequired
      photoUrl
      queueSize
      phone
      username
      email
      cashapp
      pushToken
    }
  }
`;

const EditUser = gql`
  mutation EditUser($id: String!, $data: EditUserValidator!) {
    editUser(id: $id, data: $data) {
      username
    }
  }
`;

export function EditDetails() {
  const { id } = useParams();
  const toast = useToast();
  const { handleSubmit, register, reset, formState: { errors, isSubmitting, isValid } } = useForm<EditUserMutationVariables['data']>();
  const { data: raw, loading, error } = useQuery<GetEditableUserQuery>(GetEditableUser, {
    variables: { id },
    onCompleted: (data) => {
      if (data) {
        const user = { ...data.getUser };
        delete user.__typename;
        reset(user)
      }
    }
  });
  const [edit, { error: editError }] = useMutation<EditUserMutation>(EditUser);

  const user = { ...raw?.getUser, __typename: undefined };

  const validationErrors = useValidationErrors<EditUserMutationVariables['data']>(editError);

  const onSubmit = handleSubmit(async (data) => {
    const result = await edit({ variables: { id, data } });

    if (result.data) {
      toast({ status: 'success', title: "Success", description: `Successfully edited ${user.first}'s profile` });
    }
  });

  if (error) {
    return <Error error={error} />;
  }

  if (!user || loading) {
    return <Loading />;
  }

  delete user.__typename;

  const keys = Object.keys(user);

  return (
    <Box>
      {editError && !validationErrors ? <Error error={editError} /> : null}
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          {keys.map((_key) => {
            const key = _key as keyof Omit<GetEditableUserQuery['getUser'], '__typename'>;
            const type = typeof user[key];
            return (
              <FormControl key={key} isInvalid={Boolean(errors[key]) || Boolean(validationErrors?.[key])}>
                <FormLabel>{key}</FormLabel>
                {type === 'boolean' ?
                  <Checkbox {...register(key)} />
                :
                  <Input
                    type={type === 'number' ? 'number' : 'text'}
                    {...register(key, {
                      valueAsNumber: type === 'number'
                    })}
                  />
                }
                <FormErrorMessage>
                  {errors[key] && errors[key]?.message}
                  {validationErrors?.[key] && validationErrors[key]?.[0]}
                </FormErrorMessage>
              </FormControl>
            );
          })}
          <Button type="submit" isLoading={isSubmitting}>Update User</Button>
        </Stack>
      </form>
    </Box>
  );
}