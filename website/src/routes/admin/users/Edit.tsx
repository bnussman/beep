import { useParams } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import { gql, useMutation, useQuery } from '@apollo/client';
import { EditUserMutation, GetEditableUserQuery } from '../../../generated/graphql';
import { Error } from '../../../components/Error';
import { Success } from '../../../components/Success';
import React from "react";
import { Box, Button, Center, FormControl, FormLabel, Heading, Spinner } from "@chakra-ui/react";

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
  const { userId } = useParams<{ userId: string }>();
  const { data: user, loading, error } = useQuery<GetEditableUserQuery>(GetEditableUser, { variables: { id: userId } });
  const [edit, { data, error: editError }] = useMutation<EditUserMutation>(EditUser);

  async function updateUser(values: any) {
    await edit({
      variables: {
        id: userId,
        data: values
      }
    })
  }

  return (
    <Box>
      <Heading>Edit User</Heading>
      {data && <Success message="Successfully Edited User" />}
      {error && <Error error={error} />}
      {editError && <Error error={editError.message}/>}

      {loading && 
        <Center h="100px">
          <Spinner size="xl" />
        </Center>
      }

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
              const type = typeof user.getUser[key];
              if (type === "number") {

                return (
                    <FormControl>
                        <FormLabel>{key}</FormLabel>
                        <Field type="number" name={key} />
                    </FormControl>
                );
              }
              else {
                return (
                    <FormControl>
                        <FormLabel>{key}</FormLabel>
                        {type === "boolean" ?
                            <Field type="checkbox" name={key} />
                            :
                            <Field type="text" name={key} />
                        }
                    </FormControl>
                );
              }
            })}
            <Button
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
