import React from "react";
import { useSubscription } from "../../../../utils/subscriptions";
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
import { Table } from "@heroui/react";
import {
  Typography,
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

  useSubscription({
    ...orpc.beeper.watchQueue.liveOptions({
      input: userId,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(orpc.beeper.queue.queryKey({ input: userId }), data);
    },
  });

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="User queue" className="min-w-225">
          <Table.Header>
            <Table.Column>Rider</Table.Column>
            <Table.Column>Origin</Table.Column>
            <Table.Column>Destination</Table.Column>
            <Table.Column>Group Size</Table.Column>
            <Table.Column>Start Time</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
          {isLoading && <TableLoading colSpan={6} />}
          {error && <TableError colSpan={6} error={error.message} />}
          {data?.length === 0 && <TableEmpty colSpan={6} />}
          {data?.map((beep) => (
            <Table.Row key={beep.id}>
              <TableCellUser user={beep.rider} />
              <Table.Cell>{beep.origin}</Table.Cell>
              <Table.Cell>{beep.destination}</Table.Cell>
              <Table.Cell>{beep.groupSize}</Table.Cell>
              <Table.Cell>{DateTime.fromJSDate(beep.start).toRelative()}</Table.Cell>
              <Table.Cell>
                <Stack direction="row" spacing={1} sx={{
                  alignItems: "center"
                }}>
                  <Indicator color={beepStatusMap[beep.status]} />
                  <Typography sx={{ textTransform: "capitalize" }}>
                    {beep.status.replaceAll("_", " ")}
                  </Typography>
                </Stack>
              </Table.Cell>
            </Table.Row>
          ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
