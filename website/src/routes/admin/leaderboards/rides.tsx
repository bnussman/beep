import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { keepPreviousData } from "@tanstack/react-query";
import { Table } from "@heroui/react";
import { orpc } from "../../../utils/orpc";
import { BasicUser } from "../../../components/BasicUser";

export const Route = createFileRoute('/admin/leaderboards/rides')({
  component: Rides,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
});

function Rides() {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const { isLoading, error, data } = useQuery(
    orpc.user.usersWithRides.queryOptions({
      input: { page },
      placeholderData: keepPreviousData,
    }),
  );

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  return (
    <div className="flex flex-col gap-2">
      <PaginationFooter
        pages={data?.pages}
        page={page}
        pageSize={data?.pageSize}
        results={data?.results}
        onPageChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Users by ride count">
            <Table.Header>
              <Table.Column isRowHeader>User</Table.Column>
              <Table.Column>Rides</Table.Column>
            </Table.Header>
            <Table.Body>
              {isLoading && <TableLoading colSpan={2} />}
              {error && <TableError colSpan={2} error={error.message} />}
              {data?.users?.map(({ user, rides }) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <BasicUser user={user} />
                  </Table.Cell>
                  <Table.Cell>{rides}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <PaginationFooter
        pages={data?.pages}
        page={page}
        pageSize={data?.pageSize}
        results={data?.results}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
