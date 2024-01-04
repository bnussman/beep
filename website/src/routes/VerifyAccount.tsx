import React from 'react';
import { useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { VerifyAccountMutation } from '../generated/graphql';
import { Loading } from '../components/Loading';
import { Box } from '@chakra-ui/react';
import { Route } from '@tanstack/react-router';
import { rootRoute } from '../App';

const VerifyAccountGraphQL = gql`
  mutation VerifyAccount($id: String!) {
    verifyAccount(id: $id)
  }
`;

export const verifyAccountRoute = new Route({
  component: VerifyAccount,
  path: "/account/verify/$id",
  getParentRoute: () => rootRoute,
});

export function VerifyAccount() {
  const { id } = verifyAccountRoute.useParams();
  const [verify, { data, loading, error }] = useMutation<VerifyAccountMutation>(VerifyAccountGraphQL);

  async function handleVerify(): Promise<void> {
    try {
      await verify({
        variables: {
          id: id
        },
        refetchQueries: () => ["GetUserData"]
      });
    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <Box>
      {loading && <Loading />}
      {data && <Success message="Successfully verified email" />}
      {error && <Error error={error} />}
    </Box>
  );
}
