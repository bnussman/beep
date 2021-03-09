import React, { useState } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from '../../../components/Card';
import { Table, THead, TH, TBody, TR, TDText, TDProfile } from '../../../components/Table';
import { Heading3 } from '../../../components/Typography';
import Pagination from '../../../components/Pagination';
import {gql, useQuery} from '@apollo/client';
import {LocationsQuery} from '../../../generated/graphql';

dayjs.extend(duration);

const LocationsGraphQL = gql`
    query Locations($show: Int, $offset: Int){
        getLocations(show: $show, offset: $offset) {
            items {
                id
                latitude
                longitude
                speed
                timestamp
                user {
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

function Locations() {
    const { loading, error, data, refetch } = useQuery<LocationsQuery>(LocationsGraphQL, { variables: { offset: 0, show: 25 }});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 25;

    async function fetchLocations(page: number) {
        refetch({
            offset: page 
        })
    }

    if (loading) return <p>Loading</p>;
    if (error) console.log(error);

    return <>
        <Heading3>Locations</Heading3>

        <Pagination
            resultCount={data?.getLocations.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchLocations}
        />
        <Card>
            <Table>
                <THead>
                    <TH>User</TH>
                    <TH>Longitude</TH>
                    <TH>Latitude</TH>
                    <TH>Speed</TH>
                    <TH>Time</TH>
                </THead>
                <TBody>
                    {data.getLocations && (data.getLocations.items).map(entry => {
                        return (
                            <TR key={entry.id}>
                                <TDProfile
                                    to={`users/${entry.user.id}`}
                                    photoUrl={entry.user.photoUrl}
                                    title={entry.user.name}
                                    subtitle={`@${entry.user.username}`}>
                                </TDProfile>
                                <TDText>{entry.longitude}</TDText>
                                <TDText>{entry.latitude}</TDText>
                                <TDText>{entry.speed}</TDText>
                                <TDText>{dayjs().to(entry.timestamp)}</TDText>
                            </TR>
                        )
                    })}
                </TBody>
            </Table>
        </Card>
        <Pagination
            resultCount={data?.getLocations.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchLocations}
        />
    </>;
}

export default Locations;
