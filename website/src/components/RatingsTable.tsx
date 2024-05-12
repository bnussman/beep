import React, { useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useQuery } from '@apollo/client';
import { Pagination } from './Pagination';
import { Box, Center, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from './TdUser';
import { printStars } from '../routes/admin/ratings';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Link, createRoute } from '@tanstack/react-router';
import { userRoute } from '../routes/admin/users/User';
import { graphql } from '../graphql';

dayjs.extend(duration);

const Ratings = graphql(`
  query GetRatingsForUser($id: String, $show: Int, $offset: Int) {
    getRatings(id: $id, show: $show, offset: $offset) {
      items {
        id
        timestamp
        message
        stars
        rater {
          id
          name
          photo
          username
        }
        rated {
          id
          name
          photo
          username
        }
      }
      count
    }
  }
`);

export const ratingsTableRoute = createRoute({
  component: RatingsTable,
  path: 'ratings',
  getParentRoute: () => userRoute,
});


export function RatingsTable() {
  const pageLimit = 5;

  const { userId } = ratingsTableRoute.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, loading } = useQuery(
    Ratings, {
      variables: {
        id: userId,
        offset: (currentPage - 1) * pageLimit,
        show: pageLimit
      }
    }
  );

  if (data?.getRatings && data.getRatings.items.length === 0) {
    return (
      <Center h="100px">
        This user has no ratings.
      </Center>
    );
  }

  if (loading) {
    return (
      <Center h="100px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Pagination
        resultCount={data?.getRatings.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Rater</Th>
              <Th>Rated</Th>
              <Th>Message</Th>
              <Th>Stars</Th>
              <Th>Date</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getRatings.items.map((rating) => (
              <Tr key={rating.id}>
                <TdUser user={rating.rater} />
                <TdUser user={rating.rated} />
                <Td>{rating.message || "N/A"}</Td>
                <Td>{printStars(rating.stars)}</Td>
                <Td>{dayjs().to(rating.timestamp)}</Td>
                <Td>
                  <Link to="/admin/ratings/$ratingId" params={{ ratingId: rating.id }}>
                    <ExternalLinkIcon />
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        resultCount={data?.getRatings.count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
