import React, { useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { printStars } from "../routes/admin/ratings";
import { Link, createRoute } from "@tanstack/react-router";
import { userRoute } from "../routes/admin/users/User";
import { trpc } from "../utils/trpc";
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { PaginationFooter } from "./PaginationFooter";
import { TableCellUser } from "./TableCellUser";
import { TableLoading } from "./TableLoading";
import { TableError } from "./TableError";
import { TableEmpty } from "./TableEmpty";

dayjs.extend(duration);

export const ratingsTableRoute = createRoute({
  component: RatingsTable,
  path: "ratings",
  getParentRoute: () => userRoute,
});

export function RatingsTable() {
  const pageLimit = 5;

  const { userId } = ratingsTableRoute.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, error } = trpc.rating.ratings.useQuery({
    userId,
    cursor: currentPage,
    pageSize: pageLimit,
  });


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
                <TableCell>{dayjs().to(rating.timestamp)}</TableCell>
                <TableCell>
                  <Link
                    to="/admin/ratings/$ratingId"
                    params={{ ratingId: rating.id }}
                  >
                    Details
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
        count={data?.pages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
      />
    </Stack>
  );
}
