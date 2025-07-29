import React from "react";
import { leaderboardsRoute } from ".";
import { createRoute, Link as RouterLink, useNavigate } from "@tanstack/react-router";
import { useTRPC } from "../../../utils/trpc";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { keepPreviousData } from "@tanstack/react-query";
import {
  Table,
  Stack,
  Avatar,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Typography,
  Link,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";

export const ridesLeaderboard = createRoute({
  component: Rides,
  path: "rides",
  getParentRoute: () => leaderboardsRoute,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
});

export function Rides() {
  const trpc = useTRPC();
  const { page } = ridesLeaderboard.useSearch();
  const navigate = useNavigate({ from: "/admin/leaderboards/rides" });

  const { isLoading, error, data } = useQuery(trpc.user.usersWithRides.queryOptions(
    {
      page,
    },
    {
      placeholderData: keepPreviousData,
    },
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
            {data?.users?.map(({ user, rides }) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link component={RouterLink} to={`/admin/users/${user.id}`}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar src={user.photo ?? undefined} />
                      <Typography>
                        {user.first} {user.last}
                      </Typography>
                    </Stack>
                  </Link>
                </TableCell>
                <TableCell>{rides}</TableCell>
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
