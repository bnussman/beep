import React from 'react'
import { createFileRoute, useNavigate, Link as RouterLink } from '@tanstack/react-router';
import { useTRPC } from '../../../src/utils/trpc';
import { PaginationFooter } from '../../../src/components/PaginationFooter';
import { Avatar, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { TableLoading } from '../../../src/components/TableLoading';
import { TableError } from '../../../src/components/TableError';
import { keepPreviousData } from '@tanstack/react-query';

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/leaderboards/beeps")({
  component: Beeps,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    }
  },
});

export function Beeps() {
  const trpc = useTRPC();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const { isLoading, error, data } = useQuery(trpc.user.usersWithBeeps.queryOptions(
    {
      page,
    },
    {
      placeholderData: keepPreviousData,
    }
  ));

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <PaginationFooter
        count={data?.pages}
        page={page}
        pageSize={data?.pageSize ?? 0}
        results={data?.results}
        onChange={setCurrentPage}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Beeps</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users?.map(({ user, beeps }) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link component={RouterLink} to={`/admin/users/${user.id}`}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar src={user.photo ?? undefined} />
                      <Typography>{user.first} {user.last}</Typography>
                    </Stack>
                  </Link>
                </TableCell>
                <TableCell>{beeps}</TableCell>
              </TableRow>
            ))}
            {isLoading && <TableLoading colSpan={2} />}
            {error && <TableError colSpan={2} error={error.message} />}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        count={data?.pages}
        page={page}
        pageSize={data?.pageSize ?? 0}
        results={data?.results}
        onChange={setCurrentPage}
      />
    </Stack>
  );
}
