import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../../../src/utils/trpc";
import { TableContainer, Stack, TableHead, Paper, Typography, Table, TableCell, TableRow, TableBody } from "@mui/material";
import { TableLoading } from "../../../src/components/TableLoading";
import { TableError } from "../../../src/components/TableError";

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/users/domain")({
  component: UsersByDomain,
});

export function UsersByDomain() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.user.usersByDomain.queryOptions());

  return (
    <Stack spacing={2}>
      <Typography fontWeight="bold" variant="h4">Users by Domain</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Domain</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableLoading colSpan={2} />}
            {error && <TableError colSpan={2} error={error.message} />}
            {data?.map(({ domain, count }) => (
              <TableRow key={domain}>
                <TableCell>{domain}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
