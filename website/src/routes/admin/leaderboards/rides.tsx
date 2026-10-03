import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate, createFileRoute } from "@tanstack/react-router";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { Link } from "../../../components/Link";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { keepPreviousData } from "@tanstack/react-query";
import { Avatar, Table, Typography } from "@heroui/react";
import { orpc } from "../../../utils/orpc";

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
                    <Link to="/admin/users/$userId/$" params={{ userId: user.id }}>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <Avatar.Image alt={`${user.first} ${user.last}`} src={user.photo ?? undefined} />
                          <Avatar.Fallback>{user.first.at(0)?.toUpperCase()}{user.last.at(0)?.toUpperCase()}</Avatar.Fallback>
                        </Avatar>
                        <Typography type="body">
                          {user.first} {user.last}
                        </Typography>
                      </div>
                    </Link>
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
