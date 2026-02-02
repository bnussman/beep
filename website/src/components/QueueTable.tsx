import React from "react";
import { orpc } from "../utils/orpc";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { TableCellUser } from "./TableCellUser";
import { Indicator } from "./Indicator";
import { userRoute } from "../routes/admin/users/User";
import { beepStatusMap } from "../routes/admin/beeps";
import { createRoute } from "@tanstack/react-router";
import { TableLoading } from "./TableLoading";
import { TableEmpty } from "./TableEmpty";
import { TableError } from "./TableError";
import {
  Typography,
  Table,
  TableContainer,
  Paper,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Stack,
} from "@mui/material";

export const queueRoute = createRoute({
  component: QueueTable,
  path: "queue",
  getParentRoute: () => userRoute,
});

export function QueueTable() {
  const { userId } = queueRoute.useParams();

  const { data, isLoading, error } = useQuery(
    orpc.beeper.watchQueue.experimental_liveOptions({ input: userId })
  );

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rider</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Group Size</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <TableLoading colSpan={6} />}
          {error && <TableError colSpan={6} error={error.message} />}
          {data?.length === 0 && <TableEmpty colSpan={6} />}
          {data?.map((beep) => (
            <TableRow key={beep.id}>
              <TableCellUser user={beep.rider} />
              <TableCell>{beep.origin}</TableCell>
              <TableCell>{beep.destination}</TableCell>
              <TableCell>{beep.groupSize}</TableCell>
              <TableCell>{DateTime.fromJSDate(beep.start).toRelative()}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Indicator color={beepStatusMap[beep.status]} />
                  <Typography sx={{ textTransform: "capitalize" }}>
                    {beep.status.replaceAll("_", " ")}
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
