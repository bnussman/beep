import React, {useEffect} from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { Table, THead, TH, TBody, TR, TDProfile, TDText } from './Table';
import {Indicator} from './Indicator';
import {Heading5} from './Typography';
import {gql, useQuery} from '@apollo/client';
import {GetQueueQuery} from '../generated/graphql';

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
            timeEnteredQueue
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
    const { data, startPolling, stopPolling } = useQuery<GetQueueQuery>(Queue, { variables: { id: props.userId }});

    useEffect(() => {
        //startPolling(3000); 
        return () => {
            //stopPolling();
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

    return <>
        <div className="m-4">
        <Heading5>
            User's Queue
        </Heading5>
        <Card>
            <Table>
                <THead>
                    <TH>Rider</TH>
                    <TH>Origin</TH>
                    <TH>Destination</TH>
                    <TH>Group Size</TH>
                    <TH>Start Time</TH>
                    <TH>Is Accepted?</TH>
                    <TH>Status</TH>
                </THead>
                <TBody>
                    {data.getQueue && (data.getQueue).map(entry => {
                        return (

                            <TR key={entry.id}>
                                <TDProfile
                                    photoUrl={entry.rider.photoUrl}
                                    title={`${entry.rider.first} ${entry.rider.last}`}
                                    to={`/admin/users/${entry.rider.id}`}
                                >
                                </TDProfile>
                                <TDText>{entry.origin}</TDText>
                                <TDText>{entry.destination}</TDText>
                                <TDText>{entry.groupSize}</TDText>
                                <TDText>{dayjs().to(entry.timeEnteredQueue)}</TDText>
                                <TDText>{entry.isAccepted ? <Indicator color='green' /> : <Indicator color='red' />}</TDText>
                                <TDText>{getStatus(entry.state)}</TDText>
                            </TR>
                        )
                    })}
                </TBody>
            </Table>
        </Card>
        </div>
    </>;
}

export default QueueTable;
