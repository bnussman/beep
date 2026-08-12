import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { printStars } from "../../../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { RatingMenu } from "../../../components/RatingMenu";
import { DeleteRatingDialog } from "../../../components/DeleteRatingDialog";
import { TableEmpty } from "../../../components/TableEmpty";
import { keepPreviousData } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  Paper,
  TableBody,
} from "@mui/material";

export const Route = createFileRoute("/admin/ratings/")({
  component: Ratings,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

function Ratings() {
  const { page } = Route.useSearch();

  const navigate = useNavigate({ from: Route.id });

  const { data, isLoading, error } = useQuery(
    orpc.rating.ratings.queryOptions({
      input: {
        cursor: page,
      },
      placeholderData: keepPreviousData
    }),
  );

  const [selectedRatingId, setSelectedRatingId] = useState<string>();

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h4" fontWeight="bold">
        Ratings
      </Typography>
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
                  {DateTime.fromJSDate(rating.timestamp).toRelative()}
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
