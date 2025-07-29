import React, { useState } from "react";
import { Indicator } from "./Indicator";
import { beepStatusMap } from "../routes/admin/beeps";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../routes/admin/users/User";
import { useTRPC } from "../utils/trpc";
import { PaginationFooter } from "./PaginationFooter";
import { TableCellUser } from "./TableCellUser";
import { TableLoading } from "./TableLoading";
import { TableError } from "./TableError";
import { TableEmpty } from "./TableEmpty";
import {
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
import { DateTime, Duration } from "luxon";

import { useQuery } from "@tanstack/react-query";

export const beepsTableRoute = createRoute({
  component: BeepsTable,
  path: "beeps",
  getParentRoute: () => userRoute,
});

export function BeepsTable() {
  const trpc = useTRPC();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userId } = beepsTableRoute.useParams();

  const { data, isLoading, error } = useQuery(trpc.beep.beeps.queryOptions({
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
              <TableCell>Beeper</TableCell>
              <TableCell>Rider</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Group Size</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Started</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableLoading colSpan={8} />}
            {error && <TableError colSpan={8} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={8} />}
            {data?.beeps.map((ride) => (
              <TableRow key={ride.id}>
                <TableCellUser user={ride.beeper} />
                <TableCellUser user={ride.rider} />
                <TableCell>{ride.origin}</TableCell>
                <TableCell>{ride.destination}</TableCell>
                <TableCell>{ride.groupSize}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Indicator color={beepStatusMap[ride.status]} />
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {ride.status.replaceAll("_", " ")}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {ride.end
                    ? Duration.fromMillis(
                        new Date(ride.end).getTime() -
                          new Date(ride.start).getTime(),
                      ).rescale().toHuman()
                    : "Still in progress"}
                </TableCell>
                <TableCell>
                  {DateTime.fromISO(ride.start).toRelative()}
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
