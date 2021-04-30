import { useEffect } from 'react'
import { Card } from '../../components/Card';
import {gql, useQuery} from '@apollo/client';
import {GetBeepersQuery} from '../../generated/graphql';
import {Heading, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';

const BeepersGraphQL = gql`
    query GetBeepers {
        getBeeperList {
            id
            username
            name
            photoUrl
            singlesRate
            groupRate
            capacity
            isStudent
            queueSize
            masksRequired
        }
    }
`;

function Beepers() {
    const { data, stopPolling, startPolling, loading } = useQuery<GetBeepersQuery>(BeepersGraphQL);

    useEffect(() => {
        startPolling(4000);
        return () => {
            stopPolling();
        };
        // eslint-disable-next-line
    }, []);

    return <>
        <Heading>Active Beepers</Heading>

        <Card>
            <Table>
                <Thead>
                    <Th>Beeper</Th>
                    <Th>Queue size</Th>
                    <Th>Ride capacity</Th>
                    <Th>Rate</Th>
                    <Th>Masks required?</Th>
                </Thead>
                <Tbody>
                    
                    {data?.getBeeperList && (data.getBeeperList).map(beeper => {
                        return (
                            <Tr key={beeper.id}>
                                <Td>
                                    {beeper.name}
                                </Td>
                                <Td>{beeper.queueSize} riders</Td>
                                <Td>{beeper.capacity} riders</Td>
                                <Td>${beeper.singlesRate} / ${beeper.groupRate}</Td>
                                <Td>{beeper.masksRequired ? 'Yes' : 'No'}</Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            {loading && <div>Loading</div>}
        </Card>
    </>;
}

export default Beepers;
