import { gql } from "@apollo/client";
import { ChooseBeepMutationVariables } from "../../generated/graphql";
import { client } from "../../utils/Apollo";

const ChooseBeep = gql`
  mutation ChooseBeep(
    $beeperId: String!
    $origin: String!
    $destination: String!
    $groupSize: Float!
  ) {
    chooseBeep(
      beeperId: $beeperId
      input: {
        origin: $origin
        destination: $destination
        groupSize: $groupSize
      }
    ) {
      id
      position
      isAccepted
      origin
      destination
      state
      groupSize
      beeper {
        id
        first
        name
        singlesRate
        groupRate
        isStudent
        role
        venmo
        cashapp
        username
        phone
        photoUrl
        capacity
        queueSize
        location {
          longitude
          latitude
        }
      }
    }
  }
`;

const FindBeep = gql`
  query FindBeep {
    findBeep {
      id
      first
      last
      isStudent
      singlesRate
      groupRate
      capacity
      queueSize
      photoUrl
      role
    }
  }
`;

export async function gqlFindBeep() {
  return await client.query({ query: FindBeep });
}

export async function gqlChooseBeep(input: ChooseBeepMutationVariables) {
  return await client.mutate({ mutation: ChooseBeep, variables: input });
}
