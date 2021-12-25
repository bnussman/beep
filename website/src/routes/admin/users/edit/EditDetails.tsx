import React from "react";
import { Loading } from "../../../../components/Loading";
import { Box, Button, Checkbox, FormControl, FormLabel, Heading, Input } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import { gql, useMutation, useQuery } from '@apollo/client';
import { EditUserMutation, GetEditableUserQuery } from '../../../../generated/graphql';
import { Error } from '../../../../components/Error';
import { Success } from '../../../../components/Success';

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
  const { data, loading, error } = useQuery<GetEditableUserQuery>(GetEditableUser, { variables: { id } });
  const [edit, { data: mutateData, error: editError }] = useMutation<EditUserMutation>(EditUser);
  
  const user = { ...data?.getUser, __typename: undefined };

  async function updateUser(values: any) {
    await edit({
      variables: {
        id,
        data: values
      }
    })
  }

  return (
    <Box>
      {mutateData && <Success message="Successfully Edited User" />}
      {error && <Error error={error} />}
      {editError && <Error error={editError} />}
      {loading && <Loading />}
      {user && !loading &&
        <Formik
          initialValues={user}
          onSubmit={async (values, { setSubmitting }) => {
            await updateUser(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {Object.keys(user).filter((key) => key !== '__typename').map((key) => {
                // @ts-expect-error i dont know what to do here, this component needs to be cleaned up
                const type = typeof user[key];
                return (
                  <Field name={key}>
                    {({ field, form }: { field: any, form: any }) => (
                      <FormControl name={key} mt={2}>
                        {type === "boolean" ?
                          <>
                            <Checkbox {...field} isChecked={field.value} name={key}>
                              {key}
                            </Checkbox>
                          </>
                          :
                          (
                            (type === "number") ?
                              <>
                                <FormLabel htmlFor={key}>{key}</FormLabel>
                                <Input {...field} type="number" id={key} />
                              </>
                              :
                              <>
                                <FormLabel htmlFor={key}>{key}</FormLabel>
                                <Input {...field} id={key} />
                              </>
                          )
                        }
                      </FormControl>
                    )}
                  </Field>
                );
              }
              )}
              <Button
                mt={2}
                type="submit"
                isLoading={isSubmitting}
              >
                Update User
              </Button>
            </Form>
          )}
        </Formik>
      }
    </Box>
  );
}