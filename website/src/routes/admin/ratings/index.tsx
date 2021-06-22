import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card } from '../../../components/Card';
import Pagination from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetRatingsQuery } from '../../../generated/graphql';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import TdUser from '../../../components/TdUser';
import { NavLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Loading from '../../../components/Loading';

dayjs.extend(relativeTime);

export const RatesGraphQL = gql`
    query getRatings($show: Int, $offset: Int) {
        getRatings(show: $show, offset: $offset) {
            items {
                id
                timestamp
                message
                stars
                rater {
                    id
                    name
                    photoUrl
                    username
                }
                rated {
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


export function printStars(rating: number): string {
    let stars = "";

    for (let i = 0; i < rating; i++) {
        stars += "⭐️";
    }

    return stars;
}

function Ratings() {
    const pageLimit = 25;
    const { data, loading, refetch } = useQuery<GetRatingsQuery>(RatesGraphQL, { variables: { offset: 0, show: pageLimit } });
    const [currentPage, setCurrentPage] = useState<number>(1);

    async function fetchRatings(page: number) {
        refetch({
            offset: page
        });
    }

    return (
        <Box>
            <Heading>Ratings</Heading>
            <Pagination
                resultCount={data?.getRatings.count}
                limit={pageLimit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onPageChange={fetchRatings}
            />
            <Card>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Rater</Th>
                            <Th>Rated</Th>
                            <Th>Message</Th>
                            <Th>Stars</Th>
                            <Th>Date</Th>
                            <Th> </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data?.getRatings && (data.getRatings.items).map(rating => {
                            return (
                                <Tr key={rating.id}>
                                    <TdUser user={rating.rater} />
                                    <TdUser user={rating.rated} />
                                    <Td>{rating.message || "N/A"}</Td>
                                    <Td>{printStars(rating.stars)}</Td>
                                    <Td>{dayjs().to(rating.timestamp)}</Td>
                                    <Td>
                                        <NavLink to={`/admin/ratings/${rating.id}`}>
                                            <ExternalLinkIcon />
                                        </NavLink>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
                {loading && <Loading />}
            </Card>
            <Pagination
                resultCount={data?.getRatings.count}
                limit={pageLimit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onPageChange={fetchRatings}
            />
        </Box>
    );
}

export default Ratings;
