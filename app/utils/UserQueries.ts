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
