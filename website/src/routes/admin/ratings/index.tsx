import React, { useState } from "react";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { RatingMenu } from "./RatingMenu";
import { DeleteRatingDialog } from "./DeleteRatingDialog";
import { TableEmpty } from "../../../components/TableEmpty";
import { keepPreviousData } from "@tanstack/react-query";
import { useNotifications } from "@toolpad/core";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { trpc } from "../../../utils/trpc";
import { DateTime } from "luxon";
import { PaginationFooter } from "../../../components/PaginationFooter";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Stack,
  Typography,
  Button,
  Paper,
  TableBody,
} from "@mui/material";

export const ratingsRoute = createRoute({
  path: "ratings",
  getParentRoute: () => adminRoute,
});

export const ratingsListRoute = createRoute({
  path: "/",
  component: Ratings,
  getParentRoute: () => ratingsRoute,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Ratings() {
  const { page } = ratingsListRoute.useSearch();

  const navigate = useNavigate({ from: ratingsListRoute.id });

  const notifications = useNotifications();

  const { data, isLoading, error } = trpc.rating.ratings.useQuery(
    {
      cursor: page,
    },
    { placeholderData: keepPreviousData },
  );

  const [selectedRatingId, setSelectedRatingId] = useState<string>();

  const { mutate, isPending } = trpc.user.reconcileUserRatings.useMutation({
    onSuccess(count) {
      notifications.show(
        `Successfully reconciled user ratings. ${count} user ratings were updated`,
        {
          severity: "success",
        },
      );
    },
    onError(error) {
      notifications.show(error.message, {
        severity: "error",
      });
    },
  });

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" fontWeight="bold">
          Ratings
        </Typography>
        <Button
          loading={isPending}
          onClick={() => mutate()}
          color="warning"
          variant="outlined"
        >
          Reconcile
        </Button>
      </Stack>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        page={page}
        count={data?.pages}
        onChange={setCurrentPage}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rater</TableCell>
              <TableCell>Rated</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Stars</TableCell>
              <TableCell>Date</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.results === 0 && <TableEmpty colSpan={6} />}
            {isLoading && <TableLoading colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {data?.ratings.map((rating) => (
              <TableRow key={rating.id}>
                <TableCellUser user={rating.rater} />
                <TableCellUser user={rating.rated} />
                <TableCell>{rating.message ?? "N/A"}</TableCell>
                <TableCell>{printStars(rating.stars)}</TableCell>
                <TableCell>
                  {DateTime.fromISO(rating.timestamp).toRelative()}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <RatingMenu
                    ratingId={rating.id}
                    onDelete={() => setSelectedRatingId(rating.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        page={page}
        count={data?.pages}
        onChange={setCurrentPage}
      />
      <DeleteRatingDialog
        id={selectedRatingId}
        isOpen={selectedRatingId !== undefined}
        onClose={() => setSelectedRatingId(undefined)}
      />
    </Stack>
  );
}

export function printStars(rating: number): string {
  let stars = "";

  for (let i = 0; i < rating; i++) {
    stars += "⭐️";
  }

  return stars;
}
