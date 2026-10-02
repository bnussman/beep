import React from "react";
import { orpc } from "../../../utils/orpc";
import { Link } from "../../../components/Link";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { useQuery } from "@tanstack/react-query";
import { Alert, Avatar, EmptyState, Label, SearchField, Spinner, Table, Typography } from "@heroui/react";
import { EmptyIcon, XIcon } from "@phosphor-icons/react";

interface PaginationSearchParams {
  page: number;
  query?: string;
}

export const Route = createFileRoute('/admin/users/')({
  component: Users,
  validateSearch(search: Record<string, string>): PaginationSearchParams {
    return {
      page: Number(search?.page ?? 1),
      query: search.query ? search.query : undefined,
    };
  },
});

function Users() {
  const PAGE_SIZE = 20;
  const { page, query } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const { isLoading, isFetching, error, data } = useQuery(
    orpc.user.users.queryOptions({
      input: {
        page,
        pageSize: PAGE_SIZE,
        query: !query ? undefined : query,
      },
      placeholderData: keepPreviousData,
    }),
  );

  const setCurrentPage = (_event: unknown, page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) });
  };

  const setQuery = (query: string) => {
    if (!query) {
      navigate({
        search: (prev) => ({ ...prev, query: undefined }),
      });
    } else {
      navigate({
        search: (prev) => ({ ...prev, query, page: 1 }),
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Typography type="h1">
        Users
      </Typography>
      <SearchField
        name="users-search"
        value={query ?? ""}
        onChange={setQuery}
        className="w-full max-w-sm"
      >
        <Label className="sr-only">Search users</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Search users" />
          {isFetching && <Spinner size="sm" />}
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <Table>
        <Table.Footer>
          <PaginationFooter
            pageSize={PAGE_SIZE}
            results={data?.results}
            count={data?.pages}
            page={page}
            onChange={setCurrentPage}
          />
        </Table.Footer>
        <Table.ScrollContainer>
          <Table.Content aria-label="Users" className="min-w-160">
            <Table.Header>
              <Table.Column isRowHeader>User</Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column>Student</Table.Column>
              <Table.Column>Email verified</Table.Column>
              <Table.Column>Beeping</Table.Column>
            </Table.Header>
            <Table.Body
              // renderEmptyState={() => (
              //   <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center py-16">
              //     <EmptyIcon size={32} />
              //     <span className="text-sm text-muted">No results found</span>
              //   </EmptyState>
              // )} 
            >
              {error ? (
                <Table.Row id="error">
                  <Table.Cell colSpan={5}>
                    <Alert status="danger" role="alert">
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Title>{error.message}</Alert.Title>
                      </Alert.Content>
                    </Alert>
                  </Table.Cell>
                </Table.Row>
              ) : isLoading ? (
                <Table.Row id="loading">
                  <Table.Cell colSpan={5}>
                    <div className="flex justify-center py-10">
                      <Spinner />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : data?.results === 0 ? (
                <Table.Row id="empty">
                  <Table.Cell colSpan={5} className="py-10 text-center">
                    No results
                  </Table.Cell>
                </Table.Row>
              ) : (
                data?.users.map((user) => (
                  <Table.Row key={user.id} id={user.id}>
                    <Table.Cell>
                      <Link
                        to="/admin/users/$userId"
                        params={{ userId: user.id }}
                        className="flex items-center gap-3"
                      >
                        <Avatar>
                          <Avatar.Image
                            alt={`${user.first} ${user.last}`}
                            src={user.photo ?? undefined}
                          />
                          <Avatar.Fallback>
                            {user.first.at(0)?.toUpperCase()}{user.last.at(0)?.toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar>
                        <Typography type="body">
                          {user.first} {user.last}
                        </Typography>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <span
                        role="img"
                        aria-label={user.isStudent ? "Student" : "Not a student"}
                        className={`inline-block size-4 rounded-full ${user.isStudent ? "bg-success" : "bg-danger"}`}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        role="img"
                        aria-label={user.isEmailVerified ? "Email verified" : "Email not verified"}
                        className={`inline-block size-4 rounded-full ${user.isEmailVerified ? "bg-success" : "bg-danger"}`}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        role="img"
                        aria-label={user.isBeeping ? "Beeping" : "Not beeping"}
                        className={`inline-block size-4 rounded-full ${user.isBeeping ? "bg-success" : "bg-danger"}`}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer>
          <PaginationFooter
            pageSize={PAGE_SIZE}
            results={data?.results}
            count={data?.pages}
            page={page}
            onChange={setCurrentPage}
          />
        </Table.Footer>
      </Table>
    </div>
  );
}
