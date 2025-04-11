import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Pagination } from "../../components/Pagination";
import {
  Box,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { TdUser } from "../../components/TdUser";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from ".";
import { trpc } from "../../utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PaginationFooter } from "../../components/PaginationFooter";

dayjs.extend(relativeTime);

export const feedbackRoute = createRoute({
  component: Feedback,
  path: "feedback",
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Feedback() {
  const { page } = feedbackRoute.useSearch();
  const navigate = useNavigate({ from: feedbackRoute.id });

  const { data, isLoading, error } = trpc.feedback.feedback.useQuery(
    {
      page,
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.feedback.deleteFeedback.useMutation({
    onSuccess() {
      utils.feedback.invalidate();
    },
  });

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h4" fontWeight="bold">
        Feedback
      </Typography>
      <PaginationFooter
        results={data?.results}
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        onChange={setCurrentPage}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Created</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.feedback.map((feedback) => (
              <TableRow key={feedback.id}>
                <TdUser user={feedback.user} />
                <Td>{feedback.message}</Td>
                <Td>{dayjs().to(feedback.created)}</Td>
                <TableCell sx={{ textAlign: "right" }}>
                  <IconButton
                    colorScheme="red"
                    aria-label={`Delete feeback ${feedback.id}`}
                    icon={<DeleteIcon />}
                    size="sm"
                    isLoading={isPending}
                    onClick={() => mutate(feedback.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        results={data?.results}
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        onChange={setCurrentPage}
      />
    </Stack>
  );
}
