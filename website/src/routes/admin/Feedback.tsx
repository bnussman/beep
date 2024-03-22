import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../components/Pagination';
import { useQuery } from '@apollo/client';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../components/TdUser';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '.';
import { graphql } from '../../graphql';

dayjs.extend(relativeTime);

const FeedbackGQL = graphql(`
  query Feedback($offset: Int, $show: Int) {
    getFeedback(offset: $offset, show: $show) {
      items {
        id
        message
        created
        user {
          id
          photo
          name
        }
      }
      count
    }
  }
`);

export const feedbackRoute = createRoute({
  component: Feedback,
  path: "feedback",
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => ({ page: Number(search?.page ?? 1)})
});

export function Feedback() {
  const pageLimit = 20;
  const { page } = feedbackRoute.useSearch();
  const navigate = useNavigate({ from: feedbackRoute.id });

  const { data, loading, error } = useQuery(FeedbackGQL, { variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const feedback = data?.getFeedback.items;
  const count = data?.getFeedback.count;

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Heading>Feedback</Heading>
      <Pagination
        resultCount={count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Message</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {feedback?.map((feedback) => (
              <Tr key={feedback.id}>
                <TdUser user={feedback.user} />
                <Td>{feedback.message}</Td>
                <Td>{dayjs().to(feedback.created)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {loading && <Loading />}
      <Pagination
        resultCount={count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
