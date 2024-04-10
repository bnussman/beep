import React from "react";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { graphql } from "../../graphql";
import { useQuery } from "@apollo/client";
import { Card } from "../../components/Card";
import { Link, createRoute } from "@tanstack/react-router";
import { adminRoute } from ".";

const UsersWithDuplicateEmailsQuery = graphql(`
  query UsersWithDuplicateEmails {
    getUsersWithDuplicateEmails {
      id
      name
      email
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
  return (
    <Stack>
      <Heading>Duplicate Emails</Heading>
      {data?.getUsersWithDuplicateEmails.map((user) => (
        <Card>
          <Text>{user.email}</Text>
          <Text>{user.name}</Text>
          <Link to="/admin/users/$userId/details" params={{ userId: user.id }}>
            <Text>{user.id}</Text>
          </Link>
        </Card>
      ))}
    </Stack>
  );
}
