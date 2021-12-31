import { gql } from "@apollo/client";

export const GetUserData = gql`
  query GetUserData {
    getUser {
      id
      username
      name
      first
      last
      email
      phone
      venmo
      isBeeping
      isEmailVerified
      isStudent
      groupRate
      singlesRate
      photoUrl
      capacity
      masksRequired
      cashapp
    }
  }
`;

export const UserUpdates = gql`
  subscription UserUpdates($id: String!) {
    getUserUpdates(id: $id) {
      id
      username
      name
      first
      last
      email
      phone
      venmo
      isBeeping
      isEmailVerified
      isStudent
      groupRate
      singlesRate
      photoUrl
      capacity
      masksRequired
      cashapp
    }
  }
`;
