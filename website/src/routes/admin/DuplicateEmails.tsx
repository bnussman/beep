import { Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { graphql } from "../../graphql";
import { useQuery } from "@apollo/client";
import { Card } from "../../components/Card";

const UsersWithDuplicateEmailsQuery = graphql(`
  query UsersWithDuplicateEmails {
    getUsersWithDuplicateEmails {
      id
      name
      email
    }
  }
`);

export function DuplicateEmail() {
  const { data } = useQuery(UsersWithDuplicateEmailsQuery);
  return (
    <Stack>
      <Heading>Duplicate Emails</Heading> 
      {data?.getUsersWithDuplicateEmails.map((user) => (
        <Card>
          {user.email}           
          {user.name}
          {user.id}
        </Card>
      ))}
    </Stack>
  );
}