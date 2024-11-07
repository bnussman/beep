import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../components/Pagination';
import { Box, Heading, IconButton, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../components/TdUser';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '.';
import { trpc } from '../../utils/trpc';
import { keepPreviousData } from '@tanstack/react-query';
import { DeleteIcon } from '@chakra-ui/icons';

dayjs.extend(relativeTime);

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

  const { data, isLoading, error } = trpc.feedback.feedback.useQuery(
    {
      offset: (page - 1) * pageLimit,
      limit: pageLimit
    },
    {
      placeholderData: keepPreviousData
    }
  );

  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.feedback.deleteFeedback.useMutation({
    onSuccess() {
      utils.feedback.invalidate();
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
      <Heading>Feedback</Heading>
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
              <Th>User</Th>
              <Th>Message</Th>
              <Th>Created</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {data?.feedback.map((feedback) => (
              <Tr key={feedback.id}>
                <TdUser user={feedback.user} />
                <Td>{feedback.message}</Td>
                <Td>{dayjs().to(feedback.created)}</Td>
                <Td textAlign="end">
                  <IconButton
                    colorScheme='red'
                    aria-label={`Delete feeback ${feedback.id}`}
                    icon={<DeleteIcon />}
                    size="sm"
                    isLoading={isPending}
                    onClick={() => mutate(feedback.id)}
                  />
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
