import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { Table, THead, TH, TBody, TR, TDProfile, TDText } from './Table';
import { gql, useQuery } from '@apollo/client';
import { GetBeeperHistoryQuery } from '../generated/graphql';
import { useState } from 'react';
import Pagination from './Pagination';

dayjs.extend(duration);

interface Props {
    userId: string;
}

const Hisory = gql`
    query GetBeeperHistory($show: Int, $offset: Int, $id: String!) {
        getBeepHistory(show: $show, offset: $offset, id: $id) {
            items {
                id
                origin
                destination
                start
                end
                groupSize
                rider {
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

function BeepHistoryTable(props: Props) {
    const pageLimit = 5;
    const { data, loading, refetch } = useQuery<GetBeeperHistoryQuery>(Hisory, { variables: { id: props.userId, offset: 0, show: pageLimit }});
    const [currentPage, setCurrentPage] = useState<number>(1);

    async function fetchHistory(page: number) {
        refetch({
            id: props.userId,
            offset: page,
        })
    }
return <>
        <div className="m-4">
        <Pagination
            resultCount={data?.getBeepHistory?.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchHistory}
        />
        <Card>
            <Table>
                <THead>
                    <TH>Rider</TH>
                    <TH>Origin</TH>
                    <TH>Destination</TH>
                    <TH>Group Size</TH>
                    <TH>Start Time</TH>
                    <TH>End Time</TH>
                    <TH>Duration</TH>
                </THead>
                <TBody>
                    {data?.getBeepHistory && (data.getBeepHistory.items).map(beep => {
                        return (

                            <TR key={beep.id}>
                                <TDProfile
                                    photoUrl={beep.rider.photoUrl}
                                    title={`${beep.rider.first} ${beep.rider.last}`}
                                    subtitle={`@${beep.rider.username}`}
                                    to={`/admin/users/${beep.rider.id}`}
                                >
                                </TDProfile>
                                <TDText>{beep.origin}</TDText>
                                <TDText>{beep.destination}</TDText>
                                <TDText>{beep.groupSize}</TDText>
                                <TDText>{dayjs().to(beep.start)}</TDText>
                                <TDText>{dayjs().to(beep.end)}</TDText>
                                <TDText>{dayjs.duration(new Date(beep.end).getTime() - new Date(beep.start).getTime()).humanize()}</TDText>
                            </TR>
                        )
                    })}
                </TBody>
            </Table>
            {data?.getBeepHistory && data.getBeepHistory.items.length === 0 && 
                <div className="w-full p-4 text-center">No Data</div>
            }
            {loading && 
                <div className="w-full p-4 text-center">Loading</div>
            }
        </Card>
        <Pagination
            resultCount={data?.getBeepHistory?.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchHistory}
        />
        </div>
    </>;
}

export default BeepHistoryTable;
