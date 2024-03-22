import React from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../../components/Pagination';
import { useQuery } from '@apollo/client';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { Link, createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { graphql } from '../../../graphql';

dayjs.extend(relativeTime);

export const RatesGraphQL = graphql(`
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

export function printStars(rating: number): string {
  let stars = "";

  for (let i = 0; i < rating; i++) {
    stars += "⭐️";
  }

  return stars;
}

export const ratingsRoute = createRoute({
  path: "ratings",
  getParentRoute: () => adminRoute,
});

export const ratingsListRoute = createRoute({
  path: "/",
  component: Ratings,
  getParentRoute: () => ratingsRoute,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1)
  })
});

export function Ratings() {
  const pageLimit = 20;

  const { page } = ratingsListRoute.useSearch();

  const navigate = useNavigate({ from: ratingsListRoute.id });

  const { data, loading, error } = useQuery(RatesGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Heading>Ratings</Heading>
      <Pagination
        resultCount={data?.getRatings.count}
        limit={pageLimit}
        currentPage={page}
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
              <Th> </Th>
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
      {loading && <Loading />}
      <Pagination
        resultCount={data?.getRatings.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
