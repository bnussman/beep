import React, { useState } from "react";
import { printStars } from "../routes/admin/ratings";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../routes/admin/users/User";
import { useTRPC } from "../utils/trpc";
import { PaginationFooter } from "./PaginationFooter";
import { TableCellUser } from "./TableCellUser";
import { TableLoading } from "./TableLoading";
import { TableError } from "./TableError";
import { TableEmpty } from "./TableEmpty";
import { RatingMenu } from "../routes/admin/ratings/RatingMenu";
import { DeleteRatingDialog } from "../routes/admin/ratings/DeleteRatingDialog";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DateTime } from "luxon";

import { useQuery } from "@tanstack/react-query";

export const ratingsTableRoute = createRoute({
  component: RatingsTable,
  path: "ratings",
  getParentRoute: () => userRoute,
});

export function RatingsTable() {
  const trpc = useTRPC();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRatingId, setSelectedRatingId] = useState<string>();

  const { userId } = ratingsTableRoute.useParams();

  const { data, isLoading, error } = useQuery(trpc.rating.ratings.queryOptions({
    userId,
    cursor: currentPage,
    pageSize: 10,
  }));

  return (
    <Stack spacing={1}>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
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
            {isLoading && <TableLoading colSpan={8} />}
            {error && <TableError colSpan={8} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={8} />}
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
        count={data?.pages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
      />
      <DeleteRatingDialog
        id={selectedRatingId}
        onClose={() => setSelectedRatingId(undefined)}
        isOpen={selectedRatingId !== undefined}
      />
    </Stack>
  );
}
