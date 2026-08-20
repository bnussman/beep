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
import {
  Paper,
  Box,
  Link,
  Typography,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
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
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography fontWeight="bold" variant="h4">
          Beepers
        </Typography>
        <Chip
          variant="outlined"
          label={`${data?.length ?? 0} beepers`}
          size="small"
        />
      </Stack>
      <BeepersMap beepers={data ?? []} />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Beeper</TableCell>
              <TableCell>Queue size</TableCell>
              <TableCell>Ride capacity</TableCell>
              <TableCell>Rates</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && <TableEmpty colSpan={5} />}
            {error && <TableError colSpan={5} error={error.message} />}
            {isLoading && <TableLoading colSpan={5} />}
            {data?.map((beeper) => (
              <TableRow key={beeper.id}>
                <TableCell>
                  <Link component={RouterLink} to={`/admin/users/${beeper.id}`}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar src={beeper.photo ?? undefined} />
                      <Typography>
                        {beeper.first} {beeper.last}
                      </Typography>
                      <Box flexGrow={1} />
                      {beeper.isPremium && (
                        <Chip label="Premium 👑" size="small" />
                      )}
                    </Stack>
                  </Link>
                </TableCell>
                <TableCell>{beeper.queueSize} riders</TableCell>
                <TableCell>{beeper.capacity} riders</TableCell>
                <TableCell>
                  ${beeper.singlesRate} / ${beeper.groupRate}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
