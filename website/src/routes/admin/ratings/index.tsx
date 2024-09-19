import React from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../../components/Pagination';
import { Box, Button, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
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

  const toast = useToast();

  const { data, isLoading, error } = trpc.rating.ratings.useQuery({
    cursor: (page - 1) * pageLimit,
    show: pageLimit
  });

  const { mutate, isPending } = trpc.user.reconcileUserRatings.useMutation({
    onSuccess(count) {
      toast({
        title: "Successfully reconciled user ratings",
        description: `${count} user ratings were updated`,
        status: 'success',
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
        status: 'error',
      });
    }
  });

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Box>
      <Flex direction="row" justifyContent="space-between">
        <Heading>Ratings</Heading>
        <Button
          isLoading={isPending}
          onClick={() => mutate()}
          colorScheme="yellow"
        >
          Reconcile
        </Button>
      </Flex>
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
      {isLoading && <Loading />}
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
