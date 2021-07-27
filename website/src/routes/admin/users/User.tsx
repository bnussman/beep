import React from 'react';
import { useParams } from "react-router-dom";
import UserProfile from '../../../components/UserProfile';
import { gql, useQuery } from '@apollo/client';
import { GetUserQuery, User } from '../../../generated/graphql';
import { Error } from '../../../components/Error';
import Loading from '../../../components/Loading';

export const GetUser = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      id
      name
      isBeeping
      isStudent
      role
      venmo
      cashapp
      singlesRate
      groupRate
      capacity
      masksRequired
      photoUrl
      queueSize
      phone
      username
      rating
      email
      location {
        latitude
        longitude
      }
      queue {
        id
        origin
        destination
        start
        groupSize
        isAccepted
        state
        rider {
          id
          photoUrl
          username
          first
          last
          name
        }
      }
    }
  }
`;

function UserPage() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error, refetch } = useQuery<GetUserQuery>(GetUser, { variables: { id } });

    if (error) return <Error error={error} />;
    if (loading) return <Loading />;

    return <UserProfile user={data!.getUser as User} refetch={refetch} admin />;
}

export default UserPage;
