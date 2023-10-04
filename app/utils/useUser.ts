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
      photo
      capacity
      cashapp
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
      photo
      capacity
      cashapp
    }
  }
`;

export function useUser() {
  const { data, ...rest } = useQuery<UserDataQuery>(UserData, {
    fetchPolicy: "cache-only",
  });

  return { user: data?.getUser, ...rest };
}

export function useIsSignedIn() {
  const { data } = useQuery<UserDataQuery>(UserData, {
    fetchPolicy: "cache-only",
  });

  return Boolean(data?.getUser);
}

export function useIsSignedOut() {
  const { data } = useQuery<UserDataQuery>(UserData, {
    fetchPolicy: "cache-only",
  });

  return !Boolean(data?.getUser);
}