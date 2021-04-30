import { useState } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from '../../../components/Card';
import Pagination from '../../../components/Pagination';
import {gql, useQuery} from '@apollo/client';
import {GetBeepsQuery} from '../../../generated/graphql';
import {Heading, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';

dayjs.extend(duration);

const BeepsGraphQL = gql`
    query getBeeps($show: Int, $offset: Int) {
        getBeeps(show: $show, offset: $offset) {
            items {
                id
                origin
                destination
                start
                end
                groupSize
                beeper {
                    id
                    name
                    photoUrl
                    username
                }
                rider {
                    id
                    name
                    photoUrl
                    username
                }
            }
            count
        }
    }
`;
function Beeps() {
    const { loading, error, data, refetch } = useQuery<GetBeepsQuery>(BeepsGraphQL, { variables: { offset: 0, show: 25 }});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 25;

    async function fetchBeeps(page: number) {
        refetch({
            offset: page 
        })
    }

    if (loading) return <p>Loading</p>;
    if (error) console.log(error);

    return <>
        <Heading>Beeps</Heading>

        <Pagination
            resultCount={data?.getBeeps.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchBeeps}
        />
        <Card>
            <Table>
                <Thead>
                    <Th>Beeper</Th>
                    <Th>Rider</Th>
                    <Th>Origin</Th>
                    <Th>Destination</Th>
                    <Th>Group Size</Th>
                    <Th>Start Time</Th>
                    <Th>End Time</Th>
                    <Th>Duration</Th>
                </Thead>
                <Tbody>
                    {data?.getBeeps && (data.getBeeps.items).map(beepEntry => {
                        return (
                            <Tr key={beepEntry.id}>
                                <Td>
                                    {beepEntry.beeper.name}
                                </Td>
                                <Td>
                                    {beepEntry.rider.name}
                                </Td>
                                <Td>{beepEntry.origin}</Td>
                                <Td>{beepEntry.destination}</Td>
                                <Td>{beepEntry.groupSize}</Td>
                                <Td>{dayjs().to(beepEntry.start)}</Td>
                                <Td>{dayjs().to(beepEntry.end)}</Td>
                                <Td>{dayjs.duration(new Date(beepEntry.end).getTime() - new Date(beepEntry.start).getTime()).humanize()}</Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </Card>
        <Pagination
            resultCount={data?.getBeeps.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchBeeps}
        />
    </>;
}

export default Beeps;
