import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { Table, THead, TH, TBody, TR, TDProfile, TDText } from './Table';
import { gql, useQuery } from '@apollo/client';
import { GetRideHistoryQuery } from '../generated/graphql';
import Pagination from './Pagination';
import { useState } from 'react';

dayjs.extend(duration);

interface Props {
    userId: string;
}

const Hisory = gql`
    query GetRideHistory($id: String!, $show: Int, $offset: Int) {
        getRideHistory(id: $id, show: $show, offset: $offset) {
            items {
                id
                origin
                destination
                timeEnteredQueue
                doneTime
                groupSize
                beeper {
                    id
                    photoUrl
                    username
                    first
                    last
                    name
                }
            }
            count
        }
    }
`;

function RideHistoryTable(props: Props) {
    const pageLimit = 5;
    const { data, loading, refetch } = useQuery<GetRideHistoryQuery>(Hisory, { variables: { id: props.userId, offset: 0, show: pageLimit }});
    const [currentPage, setCurrentPage] = useState<number>(1);

    async function fetchHistory(page: number) {
        refetch({
            id: props.userId,
            offset: page
        })
    }

    return <>
        <div className="m-4">
        <Pagination
            resultCount={data?.getRideHistory?.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchHistory}
        />
        <Card>
            <Table>
                <THead>
                    <TH>Beeper</TH>
                    <TH>Origin</TH>
                    <TH>Destination</TH>
                    <TH>Group Size</TH>
                    <TH>Start Time</TH>
                    <TH>End Time</TH>
                    <TH>Duration</TH>
                </THead>
                <TBody>
                    {data?.getRideHistory && (data.getRideHistory.items).map(ride => {
                        return (

                            <TR key={ride.id}>
                                <TDProfile
                                    photoUrl={ride.beeper.photoUrl}
                                    title={`${ride.beeper.first} ${ride.beeper.last}`}
                                    subtitle={`@${ride.beeper.username}`}
                                    to={`/admin/users/${ride.beeper.id}`}
                                >
                                </TDProfile>
                                <TDText>{ride.origin}</TDText>
                                <TDText>{ride.destination}</TDText>
                                <TDText>{ride.groupSize}</TDText>
                                <TDText>{dayjs().to(ride.timeEnteredQueue)}</TDText>
                                <TDText>{dayjs().to(ride.doneTime)}</TDText>
                                <TDText>{dayjs.duration(ride.doneTime - ride.timeEnteredQueue).humanize()}</TDText>
                            </TR>
                        )
                    })}
                </TBody>
            </Table>
            {data?.getRideHistory && data.getRideHistory.items.length === 0 && 
                <div className="w-full p-4 text-center">No Data</div>
            }
            {loading && 
                <div className="w-full p-4 text-center">Loading</div>
            }
        </Card>
        <Pagination
            resultCount={data?.getRideHistory?.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchHistory}
        />
        </div>
    </>;
}

export default RideHistoryTable;
