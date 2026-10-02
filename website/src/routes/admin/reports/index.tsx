import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Indicator } from "../../../components/Indicator";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { TableLoading } from "../../../components/TableLoading";
import { ReportMenu } from "../../../components/ReportMenu";
import { DeleteReportDialog } from "../../../components/DeleteReportDialog";
import { keepPreviousData } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { Table } from "@heroui/react";
import { Typography } from "@heroui/react";
import {
} from "@mui/material";
import { orpc } from "../../../utils/orpc";

export const Route = createFileRoute('/admin/reports/')({
  component: Reports,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

function Reports() {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const onDelete = (id: string) => {
    setSelectedReportId(id);
  };

  const { data, isLoading, error } = useQuery(
    orpc.report.reports.queryOptions({
      input: {
        page,
      },
      placeholderData: keepPreviousData
    }),
  );

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <div className="flex flex-col gap-2">
      <Typography type="h1">
        Reports
      </Typography>
      <PaginationFooter
        results={data?.results}
        count={data?.pages}
        page={page}
        pageSize={data?.pageSize ?? 0}
        onChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Reports" className="min-w-275">
            <Table.Header>
              <Table.Column>Reporter</Table.Column>
              <Table.Column>Reported</Table.Column>
              <Table.Column>Type</Table.Column>
              <Table.Column>Reason</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column>Handled</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {data?.results === 0 && <TableEmpty colSpan={7} />}
            {error && <TableError colSpan={7} error={error.message} />}
            {isLoading && <TableLoading colSpan={7} />}
            {data?.reports.map((report) => (
              <Table.Row key={report.id}>
                <TableCellUser user={report.reporter} />
                <TableCellUser user={report.reported} />
                <Table.Cell>{report.rating_id ? 'Rating' : report.beep_id ? "Beep" : "General"}</Table.Cell>
                <Table.Cell>{report.reason}</Table.Cell>
                <Table.Cell>
                  {DateTime.fromJSDate(report.timestamp).toRelative()}
                </Table.Cell>
                <Table.Cell>
                  <Indicator color={report.handled ? "green" : "red"} />
                </Table.Cell>
                <Table.Cell className="text-right">
                  <ReportMenu
                    reportId={report.id}
                    onDelete={() => onDelete(report.id)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
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
    </div>
  );
}
