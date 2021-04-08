import { useParams } from "react-router-dom";
import { Heading1, Heading3, Heading5 } from '../../../components/Typography';
import { Formik, Form, Field } from 'formik';
import {gql, useMutation, useQuery} from '@apollo/client';
import { EditUserMutation, GetEditableUserQuery } from '../../../generated/graphql';
import { Error } from '../../../components/Error';
import { Success } from '../../../components/Success';

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
    const [edit, {data, error: editError}] = useMutation<EditUserMutation>(EditUser);

    async function updateUser(values: any) {
        await edit({ variables: {
            id: userId,
            data: values
        }})
    }

    if (loading) {
        return <Heading1>Loading</Heading1>;
    }

    return (
        <>
            <Heading3>Edit User</Heading3>
            {data && <Success message="Successfully Edited User"/>}
            {error && <Error error={error} />}
            {editError && editError.message}

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
                                    <div key={key}>
                                        <Heading5>{key}</Heading5>
                                        <Field type="number" name={key} className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-yellow-500 dark:bg-gray-800 dark:text-white"/>
                                    </div>
                                );
                            }
                            else {
                                return (
                                    <div key={key}>
                                        <Heading5>{key}</Heading5>
                                        {type === "boolean" ?
                                        <Field type="checkbox" name={key}/>
                                        :
                                        <Field type="text" name={key} className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-yellow-500 dark:bg-gray-800 dark:text-white"/>
                                        }
                                    </div>
                                );
                            }
                        })}
                        <button
                            type="submit"
                            className={`mt-3 inline-flex justify-center py-2 px-4 mr-1 border  text-sm font-medium rounded-md text-white shadow-sm bg-yellow-500 hover:bg-yellow-600 focus:outline-white`}
                            disabled={isSubmitting}>
                            {isSubmitting ? "Loading..." : "Update User"}
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default EditUserPage;
