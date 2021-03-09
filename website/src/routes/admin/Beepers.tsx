import React, { useEffect } from 'react'
import { Heading3 } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Table, THead, TH, TBody, TR, TDProfile, TDText } from '../../components/Table';
import {gql, useQuery} from '@apollo/client';
import {GetBeepersQuery} from '../../generated/graphql';

const BeepersGraphQL = gql`
    query GetBeepers {
        getBeeperList {
            id
            username
            photoUrl
            singlesRate
            groupRate
            capacity
            isStudent
            first
            last
            queueSize
            masksRequired
        }
    }
`;

function Beepers() {
    const { data, stopPolling, startPolling } = useQuery<GetBeepersQuery>(BeepersGraphQL);

    useEffect(() => {
        startPolling(4000);
        return () => {
            stopPolling();
        };
        // eslint-disable-next-line
    }, []);

    return <>
        <Heading3>Active Beepers</Heading3>

        <Card>
            <Table>
                <THead>
                    <TH>Beeper</TH>
                    <TH>Queue size</TH>
                    <TH>Ride capacity</TH>
                    <TH>Rate</TH>
                    <TH>Masks required?</TH>
                </THead>
                <TBody>
                    {data?.getBeeperList && (data.getBeeperList).map(beeper => {
                        return (
                            <TR key={beeper.id}>
                                <TDProfile
                                    to={`users/${beeper.id}`}
                                    photoUrl={beeper?.photoUrl}
                                    title={`${beeper.first} ${beeper.last} ${beeper.isStudent ? '🎓' : ''}`}>
                                </TDProfile>
                                <TDText>{beeper.queueSize} riders</TDText>
                                <TDText>{beeper.capacity} riders</TDText>
                                <TDText>${beeper.singlesRate} / ${beeper.groupRate}</TDText>
                                <TDText>{beeper.masksRequired ? 'Yes' : 'No'}</TDText>
                            </TR>
                        )
                    })}
                </TBody>
            </Table>
        </Card>
    </>;
}

export default Beepers;
