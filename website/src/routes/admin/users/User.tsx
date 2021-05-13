import { useParams } from "react-router-dom";
import UserProfile from '../../../components/UserProfile';
import { gql, useQuery } from '@apollo/client';
import {GetUserQuery} from '../../../generated/graphql';
import React from "react";
import { Heading } from "@chakra-ui/react";

const GetUser = gql`
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
            location {
                latitude
                longitude
            }
        }
    }
`;

function UserPage() {
    const { userId } = useParams<{ userId: string }>();
    const { data, loading, error } = useQuery<GetUserQuery>(GetUser, { variables: { id: userId } }); 

    return (
        <>
            <Heading>User</Heading>
            {error && error}
            {loading ? <Heading>Loading</Heading> : <UserProfile user={data?.getUser} admin />}
        </>
    );
}

export default UserPage;
