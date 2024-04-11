import React from "react";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { graphql } from "../../graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Card } from "../../components/Card";
import { Link, createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";

const UsersWithDuplicateEmailsQuery = graphql(`
  query UsersWithDuplicateEmails {
    getUsersWithDuplicateEmails {
      id
      name
      email
      beeps
    }
  }
`);

const SendEmails = graphql(`
  mutation SendDuplicateEmailNotification {
    sendDuplicateEmailNotification {
      id
      name
      email
      beeps
    }
  }
`);

export const duplicateEmailRoute = createRoute({
  path: 'duplicate-emails',
  component: DuplicateEmail,
  getParentRoute: () => adminRoute,
});

export function DuplicateEmail() {
  const { data } = useQuery(UsersWithDuplicateEmailsQuery);
  const [mutate, { loading }] = useMutation(SendEmails);

  return (
    <Stack>
      <Heading>Duplicate Emails</Heading>
      <Button onClick={() => mutate()} isLoading={loading}>Send Email Notification</Button>
      {data?.getUsersWithDuplicateEmails.map((user) => (
        <Card>
          <Text>{user.email}</Text>
          <Text>{user.name}</Text>
          <Link to="/admin/users/$userId/details" params={{ userId: user.id }}>
            <Text>{user.id}</Text>
          </Link>
          <Text>Beeps: {user.beeps}</Text>
        </Card>
      ))}
    </Stack>
  );
}
