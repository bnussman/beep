import React from "react";
import { Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";
import { trpc } from "../../utils/trpc";

export const duplicateRoute = createRoute({
  component: UsersWithDuplicateEmail,
  path: "duplicate",
  getParentRoute: () => adminRoute,
});

export function UsersWithDuplicateEmail() {
  const { data, isLoading, error } = trpc.user.emailsWithManyAccounts.useQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Stack spacing={4}>
      <Heading>Users with duplicate emails</Heading>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </Stack>
  );
}
