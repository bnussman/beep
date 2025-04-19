import React, { useState } from "react";
import { Indicator } from "./Indicator";
import { beepStatusMap } from "../routes/admin/beeps";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../routes/admin/users/User";
import { trpc } from "../utils/trpc";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { PaginationFooter } from "./PaginationFooter";
import { TableCellUser } from "./TableCellUser";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const beepsTableRoute = createRoute({
  component: BeepsTable,
  path: "beeps",
  getParentRoute: () => userRoute,
});

export function BeepsTable() {
  const pageLimit = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userId } = beepsTableRoute.useParams();

  const { data, isLoading, error } = trpc.beep.beeps.useQuery({
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
              <TableCell>Beeper</TableCell>
              <TableCell>Rider</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Group Size</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>When</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                    ? dayjs
                        .duration(
                          new Date(ride.end).getTime() -
                            new Date(ride.start).getTime(),
                        )
                        .humanize()
                    : "Still in progress"}
                </TableCell>
                <TableCell>{dayjs().to(ride.end)}</TableCell>
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
