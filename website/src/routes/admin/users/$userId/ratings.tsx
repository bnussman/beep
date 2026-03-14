import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router"
import { useTRPC } from "../../../../utils/trpc";
import { PaginationFooter } from "../../../../components/PaginationFooter";
import { TableLoading } from "../../../../components/TableLoading";
import { TableError } from "../../../../components/TableError";
import { TableEmpty } from "../../../../components/TableEmpty";
import { printStars } from "../../ratings";
import { TableCellUser } from "../../../../components/TableCellUser";
import { RatingMenu } from "../../../../components/RatingMenu";
import { DeleteRatingDialog } from "../../../../components/DeleteRatingDialog";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
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

export const Route = createFileRoute("/admin/users/$userId/ratings")({
  component: RatingsTable,
});

function RatingsTable() {
  const trpc = useTRPC();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRatingId, setSelectedRatingId] = useState<string>();

  const { userId } = Route.useParams();

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
