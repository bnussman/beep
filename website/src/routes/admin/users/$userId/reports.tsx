import React, { useState } from "react";
import { orpc } from "../../../../utils/orpc";
import { Indicator } from "../../../../components/Indicator";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PaginationFooter } from "../../../../components/PaginationFooter";
import { TableLoading } from "../../../../components/TableLoading";
import { TableCellUser } from "../../../../components/TableCellUser";
import { TableError } from "../../../../components/TableError";
import { TableEmpty } from "../../../../components/TableEmpty";
import { ReportMenu } from "../../../../components/ReportMenu";
import { DeleteReportDialog } from "../../../../components/DeleteReportDialog";
import { Table } from "@heroui/react";

export const Route = createFileRoute("/admin/users/$userId/reports")({
  component: ReportsTable,
});

function ReportsTable() {
  const { userId } = Route.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedReportId, setSelectedReportId] = useState<string>();

  const { data, isLoading, error } = useQuery(
    orpc.report.reports.queryOptions({
      input: {
        userId,
        page: currentPage,
        pageSize: 10,
      }
    })
  );

  return (
    <div className="flex flex-col gap-2">
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        page={currentPage}
        count={data?.pages}
        onChange={(e, page) => setCurrentPage(page)}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="User reports" className="min-w-250">
            <Table.Header>
              <Table.Column>Reporter</Table.Column>
              <Table.Column>Reported User</Table.Column>
              <Table.Column>Reason</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column>Resolved</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {isLoading && <TableLoading colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={6} />}
            {data?.reports.map((report) => (
              <Table.Row key={report.id}>
                <TableCellUser user={report.reporter} />
                <TableCellUser user={report.reported} />
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
                    onDelete={() => setSelectedReportId(report.id)}
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
    </div>
  );
}
