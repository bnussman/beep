import React from "react";
import { Indicator } from "../../../components/Indicator";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { RouterOutput, trpc } from "../../../utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableError } from "../../../components/TableError";
import { TableLoading } from "../../../components/TableLoading";
import { TableEmpty } from "../../../components/TableEmpty";
import { DateTime, Duration, Interval } from "luxon";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export const beepStatusMap: Record<
  RouterOutput["beep"]["beep"]["status"],
  string
> = {
  waiting: "orange",
  on_the_way: "orange",
  accepted: "green",
  in_progress: "green",
  here: "green",
  denied: "red",
  canceled: "red",
  complete: "green",
};

export const beepsRoute = createRoute({
  path: "beeps",
  getParentRoute: () => adminRoute,
});

export const beepsListRoute = createRoute({
  path: "/",
  getParentRoute: () => beepsRoute,
  component: Beeps,
  validateSearch: (search) => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
});

export function Beeps() {
  const { page } = beepsListRoute.useSearch();
  const navigate = useNavigate({ from: beepsListRoute.id });

  const { data, isLoading, error } = trpc.beep.beeps.useQuery(
    {
      page,
    },
    {
      refetchInterval: 5_000,
      refetchOnMount: true,
      placeholderData: keepPreviousData,
    },
  );

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <Typography fontWeight="bold" variant="h4">
        Beeps
      </Typography>
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
              <TableCell>Group</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error && <TableError colSpan={9} error="Unable to fetch beeps" />}
            {isLoading && <TableLoading colSpan={9} />}
            {data?.results === 0 && <TableEmpty colSpan={9} />}
            {data?.beeps.map((beep) => (
              <TableRow key={beep.id}>
                <TableCellUser user={beep.beeper} />
                <TableCellUser user={beep.rider} />
                <TableCell>{beep.origin}</TableCell>
                <TableCell>{beep.destination}</TableCell>
                <TableCell>{beep.groupSize}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Indicator color={beepStatusMap[beep.status]} />
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {beep.status.replaceAll("_", " ")}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {DateTime.fromISO(beep.start).toRelative()}
                </TableCell>
                <TableCell>
                  {beep.end ? DateTime.fromISO(beep.end).toRelative() : "N/A"}
                </TableCell>
                <TableCell>
                  {beep.end ? Interval.fromDateTimes(DateTime.fromISO(beep.start), DateTime.fromISO(beep.end)).toDuration().rescale().set({ milliseconds: 0 }).rescale().toHuman() : "N/A"}
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
