import React from "react";
import { Code, Heading, ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
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

  if (isLoading || !data) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error.message}</Error>;
  }

  const emails = Object.keys(data);

  return (
    <Stack spacing={4}>
      <Heading>Users with duplicate emails</Heading>
      <Text>There are {emails.length} emails that are being shared that we need to fix</Text>
      
      {emails.map((email) => (
        <Stack spacing={1} key={email}>
          <Heading size="md">{email}</Heading>
          <Text>User <Code>{data[email].userToDelete}</Code> will be <b>KEPT</b></Text>
          {data[email].userToDelete === null && (<Error>Needs more logic</Error>)}
          <UnorderedList>
            {data[email].users.map((user) => (
              <ListItem key={user.id}>{JSON.stringify(user)}</ListItem>
            ))}
          </UnorderedList>
        </Stack>
      ))}
    </Stack>
  );
}
