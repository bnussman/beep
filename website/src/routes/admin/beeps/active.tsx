import React from "react";
import { orpc } from "../../../utils/orpc";
import { BeepStatusChip } from "../../../components/BeepStatusChip";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableLoading } from "../../../components/TableLoading";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { BeepMenu } from "../../../components/BeepMenu";
import { Chip, Table, Typography } from "@heroui/react";

export const Route = createFileRoute("/admin/beeps/active")({
  component: ActiveBeeps,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
});

function ActiveBeeps() {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const { data, isLoading, error } = useQuery(
    orpc.beep.beeps.queryOptions({
      input: {
        page,
        inProgress: true,
      },
      refetchOnMount: true,
      refetchInterval: 3_000,
    }),
  );

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <Typography type="h1">
          Beeps
        </Typography>
        <Chip color="success" variant="secondary">
          in progress
        </Chip>
      </div>
      <PaginationFooter
        pages={data?.pages}
        pageSize={data?.pageSize}
        page={page}
        results={data?.results}
        onPageChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Active beeps">
            <Table.Header>
              <Table.Column>Beeper</Table.Column>
              <Table.Column isRowHeader>Rider</Table.Column>
              <Table.Column>Origin</Table.Column>
              <Table.Column>Destination</Table.Column>
              <Table.Column>Group Size</Table.Column>
              <Table.Column>Start Time</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body >
            {isLoading && <TableLoading colSpan={8} />}
            {error && <TableError colSpan={8} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={8} />}
            {data?.beeps.map((beep) => (
              <Table.Row key={beep.id}>
                <TableCellUser
                  user={beep.beeper}
                  linkProps={{ to: "/admin/users/$userId/queue" }}
                />
                <TableCellUser
                  user={beep.rider}
                  linkProps={{ to: "/admin/users/$userId/ride" }}
                />
                <Table.Cell>{beep.origin}</Table.Cell>
                <Table.Cell>{beep.destination}</Table.Cell>
                <Table.Cell>{beep.groupSize}</Table.Cell>
                <Table.Cell>
                  {DateTime.fromJSDate(beep.start).toRelative()}
                </Table.Cell>
                <Table.Cell>
                  <BeepStatusChip status={beep.status} />
                </Table.Cell>
                <Table.Cell>
                  <BeepMenu beepId={beep.id} />
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <PaginationFooter
        page={page}
        pages={data?.pages}
        pageSize={data?.pageSize}
        results={data?.results}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
