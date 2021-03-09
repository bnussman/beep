import React, { useState } from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { Table, THead, TH, TBody, TR, TDText } from './Table';
import {Heading5} from './Typography';
import Pagination from './Pagination';
import {gql, useQuery} from '@apollo/client';
import {GetLocationsQuery} from '../generated/graphql';

dayjs.extend(duration);

interface Props {
    userId: string;
}

const Location = gql`
    query GetLocations($id: String!) {
        getLocations(id: $id) {
            items {
                id
                longitude
                latitude
                speed
                timestamp
                accuracy
                heading
            }
            count
        }
    }
`;

function LocationTable(props: Props) {
    const pageLimit = 5;
    const { data, refetch } = useQuery<GetLocationsQuery>(Location, { variables: { id: props.userId, show: pageLimit, offset: 0}});
    const [currentPage, setCurrentPage] = useState<number>(1);

    async function fetchLocation(page: number) {
        refetch({
            variables: { id: props.userId, offset: page }
        });
    }

    if (!data?.getLocations || data.getLocations.items.length <= 0) {
        return null;
    }

    return <>
        <div className="m-4">
        <Heading5>
            User's Location Data
        </Heading5>
        <iframe
            title="Map"
            width="100%"
            height="250"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI&q=${data.getLocations.items[0].latitude},${data.getLocations.items[0].longitude}`}>
        </iframe>
        <Pagination
            resultCount={data.getLocations.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchLocation}/>
        <Card>
            <Table>
                <THead>
                    <TH>Accuracy</TH>
                    <TH>Heading</TH>
                    <TH>Latitude</TH>
                    <TH>Longitude</TH>
                    <TH>Speed</TH>
                    <TH>Timestamp</TH>
                </THead>
                <TBody>
                    {data.getLocations && (data.getLocations.items).map(location => {
                        return (

                            <TR key={location.id}>
                                <TDText>{location.accuracy} meters</TDText>
                                <TDText>{location.heading}°</TDText>
                                <TDText>{location.latitude}</TDText>
                                <TDText>{location.longitude}</TDText>
                                <TDText>{Math.round(location.speed * 2.237)} mph</TDText>
                                <TDText>{dayjs().to(location.timestamp)}</TDText>
                            </TR>
                        )
                    })}
                </TBody>
            </Table>
        </Card>
        <Pagination
            resultCount={data.getLocations.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchLocation}/>
        </div>
    </>;
}

export default LocationTable;
