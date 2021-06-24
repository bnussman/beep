import { gql } from '@apollo/client';
import { client } from '../../utils/Apollo';

const ChooseBeep = gql`
    mutation ChooseBeep($beeperId: String!, $origin: String!, $destination: String!, $groupSize: Float!) {
        chooseBeep(
        beeperId: $beeperId
        input: { origin: $origin, destination: $destination, groupSize: $groupSize }
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
                last
                singlesRate
                groupRate
                isStudent
                role
                venmo
                username
                phone
                photoUrl
                masksRequired
                capacity
                queueSize
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

export async function gqlChooseBeep(input) {
    return await client.mutate({ mutation: ChooseBeep, variables: input });
}
