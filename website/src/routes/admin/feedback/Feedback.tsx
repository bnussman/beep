import React, { useState } from "react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { trpc } from "../../../utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";
import { Delete } from "@mui/icons-material";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { TableLoading } from "../../../components/TableLoading";
import { DeleteFeedbackDialog } from "./DeleteFeedbackDialog";
import { DateTime } from "luxon";
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

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

  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string>();

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

  const selectedFeedback = data?.feedback.find(
    (f) => f.id === selectedFeedbackId,
  );

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
            {data?.results === 0 && <TableEmpty colSpan={4} />}
            {isLoading && <TableLoading colSpan={4} />}
            {error && <TableError colSpan={4} error={error.message} />}
            {data?.feedback.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCellUser user={feedback.user} />
                <TableCell>{feedback.message}</TableCell>
                <TableCell>
                  {DateTime.fromISO(feedback.created).toRelative()}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <IconButton
                    color="error"
                    aria-label={`Delete feeback ${feedback.id}`}
                    loading={isPending}
                    onClick={() => setSelectedFeedbackId(feedback.id)}
                  >
                    <Delete />
                  </IconButton>
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
      <DeleteFeedbackDialog
        isOpen={selectedFeedback !== undefined}
        onClose={() => setSelectedFeedbackId(undefined)}
        feedback={selectedFeedback}
      />
    </Stack>
  );
}
