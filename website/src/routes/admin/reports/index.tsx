import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Indicator } from "../../../components/Indicator";
import { Table, Tbody } from "@chakra-ui/react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { trpc } from "../../../utils/trpc";
import { PaginationFooter } from "../../../components/PaginationFooter";
import {
  Paper,
  Stack,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { TableLoading } from "../../../components/TableLoading";
import { ReportMenu } from "./ReportMenu";
import { DeleteReportDialog } from "./DeleteReportDialog";
import { keepPreviousData } from "@tanstack/react-query";

dayjs.extend(relativeTime);

export const reportsRoute = createRoute({
  path: "reports",
  getParentRoute: () => adminRoute,
});

export const reportsListRoute = createRoute({
  component: Reports,
  path: "/",
  getParentRoute: () => reportsRoute,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Reports() {
  const { page } = reportsListRoute.useSearch();
  const navigate = useNavigate({ from: reportsListRoute.id });

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const onDelete = (id: string) => {
    setSelectedReportId(id);
  };

  const { data, isLoading, error } = trpc.report.reports.useQuery(
    {
      page,
    },
    { placeholderData: keepPreviousData },
  );

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h4" fontWeight="bold">
        Reports
      </Typography>
      <PaginationFooter
        results={data?.results}
        count={data?.pages}
        page={page}
        pageSize={data?.pageSize ?? 0}
        onChange={setCurrentPage}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reporter</TableCell>
              <TableCell>Reported</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Handled</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <Tbody>
            {data?.results === 0 && <TableEmpty colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {isLoading && <TableLoading colSpan={6} />}
            {data?.reports.map((report) => (
              <TableRow key={report.id}>
                <TableCellUser user={report.reporter} />
                <TableCellUser user={report.reported} />
                <TableCell>{report.reason}</TableCell>
                <TableCell>{dayjs().to(report.timestamp)}</TableCell>
                <TableCell>
                  <Indicator color={report.handled ? "green" : "red"} />
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <ReportMenu
                    reportId={report.id}
                    onDelete={() => onDelete(report.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <PaginationFooter
        results={data?.results}
        count={data?.pages}
        page={page}
        pageSize={data?.pageSize ?? 0}
        onChange={setCurrentPage}
      />
      <DeleteReportDialog
        isOpen={selectedReportId !== null}
        onClose={() => setSelectedReportId(null)}
        id={selectedReportId ?? ""}
      />
    </Stack>
  );
}
