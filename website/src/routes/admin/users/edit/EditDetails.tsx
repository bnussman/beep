import React from "react";
import { Box, Button, Checkbox, FormControl, FormLabel, Input, useToast, FormErrorMessage, Stack } from "@chakra-ui/react";
import { Error } from '../../../../components/Error';
import { useForm } from "react-hook-form";
import { editUserRoute } from ".";
import { RouterInput, trpc } from "../../../../utils/trpc";

type Values = RouterInput['user']['editAdmin']['data'];

export function EditDetails() {
  const toast = useToast();

  const { userId } = editUserRoute.useParams();
  const { data: user } = trpc.user.user.useQuery(userId);

  const { mutateAsync: editUser, error: editError } = trpc.user.editAdmin.useMutation();

  const values = {
    first: user?.first,
    last: user?.last,
    email: user?.email,
    phone: user?.phone,
    venmo: user?.venmo ?? undefined,
    cashapp: user?.cashapp ?? undefined,
    isEmailVerified: user?.isEmailVerified,
    isStudent: user?.isStudent,
  };

  const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<Values>({
    defaultValues: values,
    values,
  });

  const validationErrors = editError?.data?.zodError?.fieldErrors;

  const onSubmit = handleSubmit(async (data) => {
    const result = await editUser({ userId, data });
    toast({
      status: 'success',
      title: "Success",
      description: `Successfully edited ${user?.first}'s profile`
    });
  });

  const keys = values ? Object.keys(values) : [];

  return (
    <Box>
      {editError && !validationErrors && <Error>{editError.message}</Error>}
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          {keys.map((_key) => {
            const key = _key as keyof Values;
            const type = typeof user?.[key];
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
