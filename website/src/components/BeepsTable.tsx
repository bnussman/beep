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
import { BeepMenu } from "../routes/admin/beeps/BeepMenu";

export const beepsTableRoute = createRoute({
  component: BeepsTable,
  path: "beeps",
  getParentRoute: () => userRoute,
});

export function BeepsTable() {
  const trpc = useTRPC();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userId } = beepsTableRoute.useParams();

  const { data, isLoading, error } = useQuery(
    trpc.beep.beeps.queryOptions({
      userId,
      cursor: currentPage,
      pageSize: 10,
    }),
  );

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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableLoading colSpan={9} />}
            {error && <TableError colSpan={9} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={9} />}
            {data?.beeps.map((beep) => (
              <TableRow key={beep.id}>
                <TableCellUser user={beep.beeper} linkProps={{ to: "/admin/users/$userId/queue" }} />
                <TableCellUser user={beep.rider} linkProps={{ to: "/admin/users/$userId/ride" }} />
                <TableCell>{beep.origin}</TableCell>
                <TableCell>{beep.destination}</TableCell>
                <TableCell>{beep.groupSize}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Indicator color={beepStatusMap[beep.status]} />
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {beep.status.replaceAll("_", " ")}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {beep.end
                    ? Duration.fromMillis(
                        new Date(beep.end).getTime() -
                          new Date(beep.start).getTime(),
                      )
                        .rescale()
                        .toHuman()
                    : "Still in progress"}
                </TableCell>
                <TableCell>
                  {DateTime.fromISO(beep.start).toRelative()}
                </TableCell>
                <TableCell>
                  <BeepMenu beepId={beep.id} />
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
