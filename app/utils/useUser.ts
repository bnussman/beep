import { gql, useQuery } from "@apollo/client";
import { UserDataQuery } from "../generated/graphql";
import { graphql } from "gql.tada";

export const UserData = graphql(`
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
`);

export const UserSubscription = graphql(`
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
`);

export function useUser() {
  const { data, ...rest } = useQuery(UserData, {
    fetchPolicy: "cache-only",
  });

  return { user: data?.getUser, ...rest };
}

export function useIsSignedIn() {
  const { data } = useQuery(UserData, {
    fetchPolicy: "cache-only",
  });

  return Boolean(data?.getUser);
}

export function useIsSignedOut() {
  const { data } = useQuery(UserData, {
    fetchPolicy: "cache-only",
  });

  return !Boolean(data?.getUser);
}

export function useIsUserNotBeeping() {
  const { data } = useQuery(UserData, {
    fetchPolicy: "cache-only",
  });

  return !Boolean(data?.getUser?.isBeeping);
}
