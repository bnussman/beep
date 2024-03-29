import { QueryHookOptions, useQuery } from "@apollo/client";
import { graphql, ResultOf } from "gql.tada";

export type User = ResultOf<typeof UserData>['getUser'];

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

export function useUser(options?: QueryHookOptions) {
  const query = useQuery(UserData, {
    nextFetchPolicy: "cache-only",
    ...options,
  });

  const user = query.data?.getUser;

  return { user, ...query };
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
