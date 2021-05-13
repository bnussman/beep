import { useEffect } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { Indicator } from './Indicator';
import { gql, useQuery } from '@apollo/client';
import { GetQueueQuery } from '../generated/graphql';
import TdUser from './TdUser';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

dayjs.extend(duration);

interface Props {
    userId: string;
}

const Queue = gql`
    query GetQueue($id: String!) {
        getQueue(id: $id) {
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
`;

function QueueTable(props: Props) {
    const { data, startPolling, stopPolling } = useQuery<GetQueueQuery>(Queue, { variables: { id: props.userId } });

    useEffect(() => {
        startPolling(3000); 
        return () => {
            stopPolling();
        };
        // eslint-disable-next-line
    }, []);

    function getStatus(value: number): string {
        switch (value) {
            case 0:
                return "Waiting...";
            case 1:
                return "Beeper is on the way";
            case 2:
                return "Beeper is here";
            case 3:
                return "Getting Beeped";
            default:
                return "yikes";
        }
    }

    if (!data || data.getQueue.length <= 0) {
        return null;
    }

    return (
        <Box>
            <Heading>
                User's Queue
        </Heading>
            <Card>
                <Table>
                    <Thead>
                        <Th>Rider</Th>
                        <Th>Origin</Th>
                        <Th>Destination</Th>
                        <Th>Group Size</Th>
                        <Th>Start Time</Th>
                        <Th>Is Accepted?</Th>
                        <Th>Status</Th>
                    </Thead>
                    <Tbody>
                        {data.getQueue && (data.getQueue).map(entry => {
                            return (
                                <Tr key={entry.id}>
                                    <TdUser user={entry.rider} />
                                    <Td>{entry.origin}</Td>
                                    <Td>{entry.destination}</Td>
                                    <Td>{entry.groupSize}</Td>
                                    <Td>{dayjs().to(entry.start)}</Td>
                                    <Td>{entry.isAccepted ? <Indicator color='green' /> : <Indicator color='red' />}</Td>
                                    <Td>{getStatus(entry.state)}</Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Card>
        </Box>
    );
}

export default QueueTable;
