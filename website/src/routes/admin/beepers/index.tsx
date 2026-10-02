import React from "react";
import { useSubscription } from "../../../utils/subscriptions";
import { orpc } from "../../../utils/orpc";
import { BeepersMap } from "../../../components/BeepersMap";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { TableLoading } from "../../../components/TableLoading";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getFormattedRating, printStars } from "../../../utils/utils";
import { Table } from "@heroui/react";
import {
  Box,
  Link,
  Typography,
  Stack,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";

export const Route = createFileRoute("/admin/beepers/")({
  component: Beepers,
});

function Beepers() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    orpc.rider.beepers.queryOptions(),
  );

  useSubscription({
    ...orpc.rider.beepersLocations.liveOptions({
      input: { longitude: 0, latitude: 0, admin: true },
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(
        orpc.rider.beepers.queryKey(),
        (oldUsers) => {
          if (!oldUsers) {
            return undefined;
          }

          const indexOfUser = oldUsers.findIndex(
            (user) => user.id === data.id,
          );

          if (indexOfUser !== -1) {
            const newData = [...oldUsers];

            newData[indexOfUser] = {
              ...oldUsers[indexOfUser],
              location: data.location,
            };

            return newData;
          }
        },
      );
    },
  })

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{
        alignItems: "center"
      }}>
        <Typography variant="h4" sx={{
          fontWeight: "bold"
        }}>
          Beepers
        </Typography>
        <Chip
          variant="outlined"
          label={`${data?.length ?? 0} beepers`}
          size="small"
        />
      </Stack>
      <BeepersMap beepers={data ?? []} />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Beepers" className="min-w-175">
            <Table.Header>
              <Table.Column isRowHeader>Beeper</Table.Column>
              <Table.Column>Queue size</Table.Column>
              <Table.Column>Ride capacity</Table.Column>
              <Table.Column>Rates</Table.Column>
              <Table.Column>Rating</Table.Column>
            </Table.Header>
            <Table.Body>
            {data?.length === 0 && <TableEmpty colSpan={5} />}
            {error && <TableError colSpan={5} error={error.message} />}
            {isLoading && <TableLoading colSpan={5} />}
            {data?.map((beeper) => (
              <Table.Row key={beeper.id}>
                <Table.Cell>
                  <Link component={RouterLink} to={`/admin/users/${beeper.id}`}>
                    <Stack direction="row" spacing={1} sx={{
                      alignItems: "center"
                    }}>
                      <Avatar src={beeper.photo ?? undefined} />
                      <Typography>
                        {beeper.first} {beeper.last}
                      </Typography>
                      <Box sx={{
                        flexGrow: 1
                      }} />
                      {beeper.isPremium && (
                        <Chip label="Premium 👑" size="small" />
                      )}
                    </Stack>
                  </Link>
                </Table.Cell>
                <Table.Cell>{beeper.queueSize} riders</Table.Cell>
                <Table.Cell>{beeper.capacity} riders</Table.Cell>
                <Table.Cell>
                  ${beeper.singlesRate} / ${beeper.groupRate}
                </Table.Cell>
                <Table.Cell>
                  {beeper.rating ? (
                    <Tooltip
                      title={`User rating of ${getFormattedRating(beeper.rating)}`}
                    >
                      <Typography>
                        {printStars(Number(beeper.rating))}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography>N/A</Typography>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Box>
  );
}
