import { gql, useQuery } from "@apollo/client";
import { UserDataQuery } from "../generated/graphql";

export const UserData = gql`
  query UserData {
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
      picture
      capacity
      cashapp
      pushToken
    }
  }
`;

export const UserSubscription = gql`
  subscription UserUpdates {
    getUserUpdates {
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
      picture
      capacity
      cashapp
      pushToken
    }
  }
`;

export function useUser() {
  const { data, ...rest } = useQuery<UserDataQuery>(UserData, {
    fetchPolicy: "cache-only",
  });

  return { user: data?.getUser, ...rest };
}
