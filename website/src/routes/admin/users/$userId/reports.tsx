import React, { useState } from "react";
import { Indicator } from "../../../../components/Indicator";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../../../../utils/trpc";
import { PaginationFooter } from "../../../../components/PaginationFooter";
import { TableLoading } from "../../../../components/TableLoading";
import { TableCellUser } from "../../../../components/TableCellUser";
import { TableError } from "../../../../components/TableError";
import { TableEmpty } from "../../../../components/TableEmpty";
import { ReportMenu } from "../../../../components/ReportMenu";
import { DeleteReportDialog } from "../../../../components/DeleteReportDialog";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const Route = createFileRoute("/admin/users/$userId/reports")({
  component: ReportsTable,
});

function ReportsTable() {
  const trpc = useTRPC();
  const { userId } = Route.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedReportId, setSelectedReportId] = useState<string>();

  const { data, isLoading, error } = useQuery(trpc.report.reports.queryOptions({
    userId,
    page: currentPage,
    pageSize: 10,
  }));

  return (
    <Stack spacing={1}>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        page={currentPage}
        count={data?.pages}
        onChange={(e, page) => setCurrentPage(page)}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reporter</TableCell>
              <TableCell>Reported User</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Resolved</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableLoading colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={6} />}
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
                    onDelete={() => setSelectedReportId(report.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        page={currentPage}
        count={data?.pages}
        onChange={(e, page) => setCurrentPage(page)}
      />
      <DeleteReportDialog
        id={selectedReportId ?? ""}
        isOpen={selectedReportId !== undefined}
        onClose={() => setSelectedReportId(undefined)}
      />
    </Stack>
  );
}
