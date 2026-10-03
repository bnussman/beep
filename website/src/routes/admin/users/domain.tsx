import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "@heroui/react";
import { Table } from "@heroui/react";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../../../utils/orpc";

export const Route = createFileRoute("/admin/users/domain")({
  component: UsersByDomain,
});

function UsersByDomain() {
  const { data, isLoading, error } = useQuery(orpc.user.usersByDomain.queryOptions());

  return (
    <div className="flex flex-col gap-4">
      <Typography type="h1">Users by Domain</Typography>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Users by domain">
            <Table.Header>
              <Table.Column isRowHeader>Domain</Table.Column>
              <Table.Column>Count</Table.Column>
            </Table.Header>
            <Table.Body>
            {isLoading && <TableLoading colSpan={2} />}
            {error && <TableError colSpan={2} error={error.message} />}
            {data?.map(({ domain, count }) => (
              <Table.Row key={domain}>
                <Table.Cell>{domain}</Table.Cell>
                <Table.Cell>{count}</Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
