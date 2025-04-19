import React, { useState } from 'react';
import { Indicator } from './Indicator';
import { createRoute } from '@tanstack/react-router';
import { userRoute } from '../routes/admin/users/User';
import { trpc } from '../utils/trpc';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PaginationFooter } from './PaginationFooter';
import { TableLoading } from './TableLoading';
import { TableCellUser } from './TableCellUser';
import { TableError } from './TableError';
import { TableEmpty } from './TableEmpty';
import { ReportMenu } from '../routes/admin/reports/ReportMenu';
import { DeleteReportDialog } from '../routes/admin/reports/DeleteReportDialog';

dayjs.extend(duration);

export const reportsTableRoute = createRoute({
  component: ReportsTable,
  path: 'reports',
  getParentRoute: () => userRoute,
});

export function ReportsTable() {
  const { userId } = reportsTableRoute.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedReportId, setSelectedReportId] = useState<string>();

  const { data, isLoading, error } = trpc.report.reports.useQuery({
    userId,
    page: currentPage,
  });


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
                <TableCell>{dayjs().to(report.timestamp)}</TableCell>
                <TableCell><Indicator color={report.handled ? 'green' : 'red'} /></TableCell>
                <TableCell sx={{ textAlign: 'right'}}>
                  <ReportMenu reportId={report.id} onDelete={() => setSelectedReportId(report.id)} />
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
        id={selectedReportId ?? ''}
        isOpen={selectedReportId !== undefined}
        onClose={() => setSelectedReportId(undefined)}
      />
    </Stack>
  );
}
