import React from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Error } from "../../../components/Error";
import { Indicator } from "../../../components/Indicator";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { RouterOutput, trpc } from "../../../utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";

dayjs.extend(duration);

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
      page
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

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Stack spacing={1}>
      <Typography fontWeight="bold" variant="h4">Beeps</Typography>
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
                <TableCell>{dayjs().to(beep.start)}</TableCell>
                <TableCell>{beep.end ? dayjs().to(beep.end) : "N/A"}</TableCell>
                <TableCell>
                  {beep.end
                    ? dayjs
                        .duration(
                          new Date(beep.end).getTime() -
                            new Date(beep.start).getTime(),
                        )
                        .humanize()
                    : "N/A"}
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
