import React from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../../components/Pagination';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { Link, createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { trpc } from '../../../utils/trpc';

dayjs.extend(relativeTime);

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

  const { data, isPending, error } = trpc.rating.ratings.useQuery({
    offset: (page - 1) * pageLimit,
    show: pageLimit
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Box>
      <Heading>Ratings</Heading>
      <Pagination
        resultCount={data?.count}
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
            {data?.ratings.map((rating) => (
              <Tr key={rating.id}>
                <TdUser user={rating.rater} />
                <TdUser user={rating.rated} />
                <Td>{rating.message ?? "N/A"}</Td>
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
      {isPending && <Loading />}
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}

export function printStars(rating: number): string {
  let stars = "";

  for (let i = 0; i < rating; i++) {
    stars += "⭐️";
  }

  return stars;
}
