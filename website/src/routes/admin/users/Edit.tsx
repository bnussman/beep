import { useParams } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import { gql, useMutation, useQuery } from '@apollo/client';
import { EditUserMutation, GetEditableUserQuery } from '../../../generated/graphql';
import { Error } from '../../../components/Error';
import { Success } from '../../../components/Success';
import React from "react";
import { Box, Button, Checkbox, FormControl, FormLabel, Heading, Input } from "@chakra-ui/react";
import Loading from "../../../components/Loading";

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

function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, loading, error } = useQuery<GetEditableUserQuery>(GetEditableUser, { variables: { id } });
  const [edit, { data, error: editError }] = useMutation<EditUserMutation>(EditUser);

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
      <Heading>Edit User</Heading>

      {data && <Success message="Successfully Edited User" />}
      {error && <Error error={error} />}
      {editError && <Error error={editError} />}
      {loading && <Loading />}

      {user?.getUser && !loading &&
        <Formik
          initialValues={user?.getUser}
          onSubmit={async (values, { setSubmitting }) => {
            await updateUser(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {Object.keys(user?.getUser).map((key) => {
                // @ts-expect-error i dont know what to do here, this component needs to be cleaned up
                const type = typeof user.getUser[key];
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

export default EditUserPage;
