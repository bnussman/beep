import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { Table, THead, TH, TBody, TR, TDProfile, TDText } from './Table';
import {gql, useQuery} from '@apollo/client';
import {GetRideHistoryQuery} from '../generated/graphql';

dayjs.extend(duration);

interface Props {
    userId: string;
}

const Hisory = gql`
    query GetRideHistory($id: String!) {
        getRideHistory(id: $id) {
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
    }
`;

function RideHistoryTable(props: Props) {
    const { data } = useQuery<GetRideHistoryQuery>(Hisory, { variables: { id: props.userId }});

    return <>
        <div className="m-4">
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
                    {data?.getRideHistory && (data.getRideHistory).map(ride => {
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
        </Card>
        </div>
    </>;
}

export default RideHistoryTable;
