import React, { useState } from "react";
import { Indicator } from "../../../src/components/Indicator";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTRPC } from "../../../src/utils/trpc";
import { PaginationFooter } from "../../../src/components/PaginationFooter";
import { TableCellUser } from "../../../src/components/TableCellUser";
import { TableEmpty } from "../../../src/components/TableEmpty";
import { TableError } from "../../../src/components/TableError";
import { TableLoading } from "../../../src/components/TableLoading";
import { ReportMenu } from "../../../src/components/admin/reports/ReportMenu";
import { DeleteReportDialog } from "../../../src/components/admin/reports/DeleteReportDialog";
import { keepPreviousData } from "@tanstack/react-query";
import { DateTime } from "luxon";
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

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/reports/")({
  component: Reports,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Reports() {
  const trpc = useTRPC();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const onDelete = (id: string) => {
    setSelectedReportId(id);
  };

  const { data, isLoading, error } = useQuery(trpc.report.reports.queryOptions(
    {
      page,
    },
    { placeholderData: keepPreviousData },
  ));

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
          <TableBody>
            {data?.results === 0 && <TableEmpty colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {isLoading && <TableLoading colSpan={6} />}
            {data?.reports.map((report) => (
              <TableRow key={report.id}>
                <TableCellUser user={report.reporter} />
                <TableCellUser user={report.reported} />
                <TableCell>{report.reason}</TableCell>
                <TableCell>
                  {DateTime.fromISO(report.timestamp).toRelative()}
                </TableCell>
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
          </TableBody>
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
