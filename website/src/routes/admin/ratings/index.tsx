import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TdUser } from "../../../components/TdUser";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { trpc } from "../../../utils/trpc";
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
import { useToast } from "@chakra-ui/react";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";

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
    page: Number(search?.page ?? 1),
  }),
});

export function Ratings() {
  const { page } = ratingsListRoute.useSearch();

  const navigate = useNavigate({ from: ratingsListRoute.id });

  const toast = useToast();

  const { data, isLoading, error } = trpc.rating.ratings.useQuery({
    cursor: page,
  });

  const { mutate, isPending } = trpc.user.reconcileUserRatings.useMutation({
    onSuccess(count) {
      toast({
        title: "Successfully reconciled user ratings",
        description: `${count} user ratings were updated`,
        status: "success",
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
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
            {isLoading && <TableLoading colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {data?.ratings.map((rating) => (
              <TableRow key={rating.id}>
                <TableCellUser user={rating.rater} />
                <TableCellUser user={rating.rated} />
                <TableCell>{rating.message ?? "N/A"}</TableCell>
                <TableCell>{printStars(rating.stars)}</TableCell>
                <TableCell>{dayjs().to(rating.timestamp)}</TableCell>
                <TableCell>
                  <Link
                    to="/admin/ratings/$ratingId"
                    params={{ ratingId: rating.id }}
                  >
                    <ExternalLinkIcon />
                  </Link>
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
