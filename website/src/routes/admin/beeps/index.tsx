import React, { useState } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from '../../../components/Card';
import { Table, THead, TH, TBody, TR, TDText, TDButton, TDProfile } from '../../../components/Table';
import { Heading3 } from '../../../components/Typography';
import Pagination from '../../../components/Pagination';
import {gql, useQuery} from '@apollo/client';
import {GetBeepsQuery} from '../../../generated/graphql';

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
                    first
                    last
                    photoUrl
                    username
                }
                rider {
                    id
                    first
                    last
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
        <Heading3>Beeps</Heading3>

        <Pagination
            resultCount={data?.getBeeps.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchBeeps}
        />
        <Card>
            <Table>
                <THead>
                    <TH>Beeper</TH>
                    <TH>Rider</TH>
                    <TH>Origin</TH>
                    <TH>Destination</TH>
                    <TH>Group Size</TH>
                    <TH>Start Time</TH>
                    <TH>End Time</TH>
                    <TH>Duration</TH>
                    <TH></TH>
                </THead>
                <TBody>
                    {data?.getBeeps && (data.getBeeps.items).map(beepEntry => {
                        return (
                            <TR key={beepEntry.id}>
                                <TDProfile
                                    to={`users/${beepEntry.beeper.id}`}
                                    photoUrl={beepEntry.beeper.photoUrl}
                                    title={`${beepEntry.beeper.first} ${beepEntry.beeper.last}`}
                                    subtitle={`@${beepEntry.beeper.username}`}>
                                </TDProfile>
                                <TDProfile
                                    to={`users/${beepEntry.rider.id}`}
                                    photoUrl={beepEntry.rider.photoUrl}
                                    title={`${beepEntry.rider.first} ${beepEntry.rider.last}`}
                                    subtitle={`@${beepEntry.rider.username}`}>
                                </TDProfile>
                                <TDText>{beepEntry.origin}</TDText>
                                <TDText>{beepEntry.destination}</TDText>
                                <TDText>{beepEntry.groupSize}</TDText>
                                <TDText>{dayjs().to(beepEntry.start)}</TDText>
                                <TDText>{dayjs().to(beepEntry.end)}</TDText>
                                <TDText>{dayjs.duration(new Date(beepEntry.end).getTime() - new Date(beepEntry.start).getTime()).humanize()}</TDText>
                                <TDButton to={`beeps/${beepEntry.id}`}>View</TDButton>
                            </TR>
                        )
                    })}
                </TBody>
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
