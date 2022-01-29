import React from "react";
import { User } from "../../generated/graphql";
import { Badge, Box } from "native-base";

interface Props {
  user: Partial<User>;
}

export function Tags(props: Props): JSX.Element {
  const { user } = props;

  return (
    <Box mt={2} mb={2}>
      {user.isStudent && <Badge colorScheme="green">Student</Badge>}
      {user.masksRequired && <Badge colorScheme="blue">Masks Required</Badge>}
      {user.role == "admin" && <Badge colorScheme="red">Founder</Badge>}
    </Box>
  );
}
