import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { Table, THead, TH, TBody, TR, TDProfile, TDText } from './Table';
import {gql, useQuery} from '@apollo/client';
import {GetBeeperHistoryQuery} from '../generated/graphql';

dayjs.extend(duration);

interface Props {
    userId: string;
}

const Hisory = gql`
    query GetBeeperHistory($id: String!) {
        getBeepHistory(id: $id) {
            id
            origin
            destination
            timeEnteredQueue
            doneTime
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
    }
`;

function BeepHistoryTable(props: Props) {
    const { data, loading, error } = useQuery<GetBeeperHistoryQuery>(Hisory, { variables: { id: props.userId }});

    return <>
        <div className="m-4">
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
                    {data?.getBeepHistory && (data.getBeepHistory).map(beep => {
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
                                <TDText>{dayjs().to(beep.timeEnteredQueue)}</TDText>
                                <TDText>{dayjs().to(beep.doneTime)}</TDText>
                                <TDText>{dayjs.duration(beep.doneTime - beep.timeEnteredQueue).humanize()}</TDText>
                            </TR>
                        )
                    })}
                </TBody>
            </Table>
        </Card>
        </div>
    </>;
}

export default BeepHistoryTable;
