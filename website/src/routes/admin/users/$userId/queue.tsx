import React, { useEffect } from "react";
import { orpc } from "../../../../utils/orpc";
import { beepStatusMap } from "../../../../utils/utils";
import { createFileRoute } from "@tanstack/react-router";
import { TableLoading } from "../../../../components/TableLoading";
import { TableError } from "../../../../components/TableError";
import { TableEmpty } from "../../../../components/TableEmpty";
import { TableCellUser } from "../../../../components/TableCellUser";
import { Indicator } from "../../../../components/Indicator";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
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

export const Route = createFileRoute("/admin/users/$userId/queue")({
  component: QueueTable,
});

function QueueTable() {
  const { userId } = Route.useParams();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    orpc.beeper.queue.queryOptions({ input: userId }),
  );

  const { data: queue } = useQuery(
    orpc.beeper.watchQueue.liveOptions({ input: userId })
  );

  useEffect(() => {
    if (queue) {
      queryClient.setQueryData(orpc.beeper.queue.queryKey({ input: userId }), queue);
    }
  }, [queue]);

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
