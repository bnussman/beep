import React from "react";
import { Box, Button, Checkbox, FormControl, FormLabel, Input, useToast, FormErrorMessage, Stack } from "@chakra-ui/react";
import { useMutation, useQuery } from '@apollo/client';
import { Error } from '../../../../components/Error';
import { useValidationErrors } from "../../../../utils/useValidationErrors";
import { useForm } from "react-hook-form";
import { editUserRoute } from ".";
import { ResultOf, VariablesOf, graphql } from "gql.tada";
import { GetUser } from "../User";

interface Props {
  userId: string;
}

const EditUser = graphql(`
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
`);

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

type Values = VariablesOf<typeof EditUser>['data'];

export function EditDetails({ userId }: Props) {
  const { userId: id } = editUserRoute.useParams();
  const toast = useToast();
  
  const { data, loading, error } = useQuery(GetUser, { variables: { id: userId } });

  const user = data?.getUser;

  const defaultValues = user ? omit(user, 'id', 'name', 'location', 'queue', 'created', 'rating') : undefined;

  const [edit, { error: editError }] = useMutation(EditUser);

  const { handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm<Values>({
    defaultValues
  });

  const validationErrors = useValidationErrors<Values>(editError);

  const onSubmit = handleSubmit(async (data) => {
    const result = await edit({ variables: { id, data } });

    if (result.data) {
      toast({ status: 'success', title: "Success", description: `Successfully edited ${user?.first}'s profile` });
    }
  });

  const keys = defaultValues ? Object.keys(defaultValues) : [];

  return (
    <Box>
      {editError && !validationErrors ? <Error error={editError} /> : null}
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          {keys.map((_key) => {
            const key = _key as keyof Values;
            const type = typeof defaultValues?.[key];
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
