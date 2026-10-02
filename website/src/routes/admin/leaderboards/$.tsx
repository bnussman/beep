import React from 'react'
import { useNavigate, Link as RouterLink, createFileRoute } from '@tanstack/react-router';
import { PaginationFooter } from '../../../components/PaginationFooter';
import { Link } from '../../../components/Link';
import { Avatar, Table, Typography } from '@heroui/react';
import { TableLoading } from '../../../components/TableLoading';
import { TableError } from '../../../components/TableError';
import { keepPreviousData } from '@tanstack/react-query';
import { useQuery } from "@tanstack/react-query";
import { orpc } from '../../../utils/orpc';

export const Route = createFileRoute('/admin/leaderboards/$')({
  component: Beeps,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    }
  },
});

function Beeps() {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const { isLoading, error, data } = useQuery(
    orpc.user.usersWithBeeps.queryOptions({
      input: { page },
      placeholderData: keepPreviousData,
    }),
  );

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <div className="flex flex-col gap-2">
      <PaginationFooter
        count={data?.pages}
        page={page}
        pageSize={data?.pageSize ?? 0}
        results={data?.results}
        onChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Users by beep count">
            <Table.Header>
              <Table.Column isRowHeader>User</Table.Column>
              <Table.Column>Beeps</Table.Column>
            </Table.Header>
            <Table.Body>
            {data?.users?.map(({ user, beeps }) => (
              <Table.Row key={user.id}>
                <Table.Cell>
                  <Link to="/admin/users/$userId" params={{ userId: user.id }}>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <Avatar.Image alt={`${user.first} ${user.last}`} src={user.photo ?? undefined} />
                        <Avatar.Fallback>{user.first.at(0)?.toUpperCase()}{user.last.at(0)?.toUpperCase()}</Avatar.Fallback>
                      </Avatar>
                      <Typography type="body">{user.first} {user.last}</Typography>
                    </div>
                  </Link>
                </Table.Cell>
                <Table.Cell>{beeps}</Table.Cell>
              </Table.Row>
            ))}
            {isLoading && <TableLoading colSpan={2} />}
            {error && <TableError colSpan={2} error={error.message} />}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <PaginationFooter
        count={data?.pages}
        page={page}
        pageSize={data?.pageSize ?? 0}
        results={data?.results}
        onChange={setCurrentPage}
      />
    </div>
  );
}
