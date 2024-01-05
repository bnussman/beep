import React from "react";
import { Box, Button, Checkbox, FormControl, FormLabel, Input, useToast, FormErrorMessage, Stack } from "@chakra-ui/react";
import { gql, useMutation } from '@apollo/client';
import { EditUserInput, EditUserMutation, GetUserQuery } from '../../../../generated/graphql';
import { Error } from '../../../../components/Error';
import { useValidationErrors } from "../../../../utils/useValidationErrors";
import { useForm } from "react-hook-form";
import { editUserRoute } from ".";

interface Props {
  user: GetUserQuery['getUser'];
}

const EditUser = gql`
  mutation EditUser($id: String!, $data: EditUserInput!) {
    editUser(id: $id, data: $data) {
      id
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
      photo
      queueSize
      phone
      username
      email
      cashapp
      pushToken
    }
  }
`;

interface Omit {
  <T extends object, K extends [...(keyof T)[]]>
  (obj: T, ...keys: K): {
      [K2 in Exclude<keyof T, K[number]>]: T[K2]
  }
}

const omit: Omit = (obj, ...keys) => {
  const ret = {} as {
      [K in keyof typeof obj]: (typeof obj)[K]
  };
  let key: keyof typeof obj;
  for (key in obj) {
      if (!(keys.includes(key))) {
          ret[key] = obj[key];
      }
  }
  return ret;
};

export function EditDetails({ user }: Props) {
  const { userId: id } = editUserRoute.useParams();
  const toast = useToast();

  const defaultValues = omit(user, 'id', '__typename', 'name', 'location', 'queue', 'created', 'rating');

  const [edit, { error: editError }] = useMutation<EditUserMutation>(EditUser);

  const { handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm<EditUserInput>({
    defaultValues
  });

  const validationErrors = useValidationErrors<EditUserInput>(editError);

  const onSubmit = handleSubmit(async (data) => {
    const result = await edit({ variables: { id, data } });

    if (result.data) {
      toast({ status: 'success', title: "Success", description: `Successfully edited ${user.first}'s profile` });
    }
  });

  const keys = Object.keys(defaultValues);

  return (
    <Box>
      {editError && !validationErrors ? <Error error={editError} /> : null}
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          {keys.map((_key) => {
            const key = _key as keyof EditUserInput;
            const type = typeof defaultValues[key];
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
