import React from "react";
import { useSubscription } from "../../../utils/subscriptions";
import { orpc } from "../../../utils/orpc";
import { BeepersMap } from "../../../components/BeepersMap";
import { createFileRoute } from "@tanstack/react-router";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { TableLoading } from "../../../components/TableLoading";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getFormattedRating, printStars } from "../../../utils/utils";
import { Table, Typography, Chip, Avatar, Tooltip } from "@heroui/react";
import { Link } from "../../../components/Link";

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
    <div>
      <div className="flex items-center gap-4">
        <Typography type="h1">
          Beepers
        </Typography>
        <Chip
          variant="soft"
        >
          {data?.length ?? 0} beepers
        </Chip>
      </div>
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
                  <div className="flex flex-row justify-between items-center">
                    <Link to="/admin/users/$userId" params={{ userId: beeper.id }} className="flex items-center gap-2">
                      <Avatar>
                        <Avatar.Image alt={`${beeper.first} ${beeper.last}`} src={beeper.photo || undefined} />
                        <Avatar.Fallback>{beeper.first.at(0)?.toUpperCase()}{beeper.last.at(0)?.toUpperCase()}</Avatar.Fallback>
                      </Avatar>
                      <Typography type="body">
                        {beeper.first} {beeper.last}
                      </Typography>
                    </Link>
                    {beeper.isPremium && (
                      <Chip variant="soft">
                        Premium 👑
                      </Chip>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>{beeper.queueSize} riders</Table.Cell>
                <Table.Cell>{beeper.capacity} riders</Table.Cell>
                <Table.Cell>
                  ${beeper.singlesRate} / ${beeper.groupRate}
                </Table.Cell>
                <Table.Cell>
                  {beeper.rating ? (
                    <Tooltip>
                      <Typography type="body">
                        {printStars(Number(beeper.rating))}
                      </Typography>
                      <Tooltip.Content>
                        User rating of {getFormattedRating(beeper.rating)}
                      </Tooltip.Content>
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
    </div>
  );
}
