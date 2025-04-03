import React from 'react'
import { Paper, Box, Typography, Stack, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Avatar, Chip, Tooltip } from '@mui/material';
import { BeepersMap } from './BeepersMap';
import { createRoute, Link } from '@tanstack/react-router';
import { adminRoute } from '..';
import { trpc } from '../../../utils/trpc';
import { printStars } from '../ratings';
import { TableEmpty } from '../../../components/TableEmpty';
import { TableError } from '../../../components/TableError';
import { TableLoading } from '../../../components/TableLoading';

export const beepersRoute = createRoute({
  component: Beepers,
  path: 'beepers',
  getParentRoute: () => adminRoute,
});

export function Beepers() {
  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.rider.beepers.useQuery();

  trpc.rider.beepersLocations.useSubscription(
    {
      longitude: 0,
      latitude: 0,
      admin: true,
    },
    {
      enabled: location !== undefined,
      onData(locationUpdate) {
        utils.rider.beepers.setData(undefined, (oldUsers) => {
          if (!oldUsers)  {
            return undefined;
          }

          const indexOfUser = oldUsers.findIndex((user) => user.id === locationUpdate.id);

          if (indexOfUser !== -1) {
            const newData = [...oldUsers];

            newData[indexOfUser] = { ...oldUsers[indexOfUser], location: locationUpdate.location }

            return newData;
          }
        })
      }
    }
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography fontWeight="bold" variant="h4">Beepers</Typography>
        <Chip variant="outlined" label={`${data?.length ?? 0} beepers`} size="small" />
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
                  <Link to="/admin/users/$userId" params={{ userId: beeper.id }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar src={beeper.photo ?? undefined} />
                      <Typography>{beeper.first} {beeper.last}</Typography>
                      <Box flexGrow={1} />
                      {beeper.isPremium && (
                        <Chip label="Premium 👑" size="small" />
                      )}
                    </Stack>
                  </Link>
                </TableCell>
                <TableCell>{beeper.queueSize} riders</TableCell>
                <TableCell>{beeper.capacity} riders</TableCell>
                <TableCell>${beeper.singlesRate} / ${beeper.groupRate}</TableCell>
                <TableCell>
                  {beeper.rating ? (
                    <Tooltip title={`User rating of ${beeper.rating}`}>
                      <Typography>
                        {printStars(Number(beeper.rating))}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography>
                      N/A
                    </Typography>
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
