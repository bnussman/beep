import React from "react";
import { orpc } from "../../../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { BeepMenu } from "./BeepMenu";
import { Indicator } from "../../../components/Indicator";
import { beepStatusMap } from ".";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableLoading } from "../../../components/TableLoading";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { DateTime } from "luxon";
import {
  TableBody,
  TableCell,
  Paper,
  Box,
  Chip,
  Stack,
  Table,
  TableHead,
  Typography,
  TableContainer,
  TableRow,
} from "@mui/material";

export const activeBeepsRoute = createRoute({
  component: ActiveBeeps,
  path: "beeps/active",
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
});

export function ActiveBeeps() {
  const { page } = activeBeepsRoute.useSearch();
  const navigate = useNavigate({ from: activeBeepsRoute.id });

  const { data, isLoading, error } = useQuery(
    orpc.beep.beeps.queryOptions(
      {
        input: {
          page,
          inProgress: true,
        },
        refetchOnMount: true,
        refetchInterval: 5_000,
      },
    ),
  );

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography fontWeight="bold" variant="h4">
          Beeps
        </Typography>
        <Chip
          color="success"
          variant="outlined"
          size="small"
          label="in progress"
        />
      </Stack>
      <PaginationFooter
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        results={data?.results}
        onChange={setCurrentPage}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Beeper</TableCell>
              <TableCell>Rider</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Group Size</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableLoading colSpan={8} />}
            {error && <TableError colSpan={8} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={8} />}
            {data?.beeps.map((beep) => (
              <TableRow key={beep.id}>
                <TableCellUser user={beep.beeper} />
                <TableCellUser user={beep.rider} />
                <TableCell>{beep.origin}</TableCell>
                <TableCell>{beep.destination}</TableCell>
                <TableCell>{beep.groupSize}</TableCell>
                <TableCell>
                  {DateTime.fromJSDate(beep.start).toRelative()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Indicator color={beepStatusMap[beep.status]} />
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {beep.status.replaceAll("_", " ")}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <BeepMenu beepId={beep.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        results={data?.results}
        onChange={setCurrentPage}
      />
    </Stack>
  );
}
