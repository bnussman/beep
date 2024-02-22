import { useQuery } from '@apollo/client';
import { graphql } from 'gql.tada';

export const UserQuery = graphql(`
  query GetUserData {
    getUser {
      id
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
      username
      role
      cashapp
      queueSize
    }
  }
`);

export const UserSubscription = graphql(`
  subscription UserUpdates {
    getUserUpdates {
      id
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
      username
      role
      cashapp
      queueSize
    }
  }
`);

export function useUser() {
  const { data } = useQuery(UserQuery, { fetchPolicy: "cache-only" });
  const user = data?.getUser;
  return { user };
}
