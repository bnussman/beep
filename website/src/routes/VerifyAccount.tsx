import React from 'react';
import { useEffect } from 'react';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { Loading } from '../components/Loading';
import { Box } from '@chakra-ui/react';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../utils/root';
import { trpc } from '../utils/trpc';

export const verifyAccountRoute = createRoute({
  component: VerifyAccount,
  path: "/account/verify/$id",
  getParentRoute: () => rootRoute,
});

export function VerifyAccount() {
  const { id } = verifyAccountRoute.useParams();

  const {
    mutateAsync: verifyEmail,
    data,
    isPending,
    error
  } = trpc.auth.verifyAccount.useMutation();

  const handleVerify = async () => {
    try {
      await verifyEmail({ id });
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
      {isPending && <Loading />}
      {data && <Success message="Successfully verified email" />}
      {error && <Error>{error.message}</Error>}
    </Box>
  );
}
