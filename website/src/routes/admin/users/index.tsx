import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { Indicator } from "../../../components/Indicator";
import { Pagination } from "../../../components/Pagination";
import { TdUser } from "../../../components/TdUser";
import { Error } from "../../../components/Error";
import { SearchIcon } from "@chakra-ui/icons";
import { Loading } from "../../../components/Loading";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { trpc } from "../../../utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";

export interface PaginationSearchParams {
  page: number;
  query?: string;
}

export const usersRoute = createRoute({
  path: "users",
  getParentRoute: () => adminRoute,
});

export const usersListRoute = createRoute({
  component: Users,
  path: "/",
  getParentRoute: () => usersRoute,
  validateSearch: (search: Record<string, string>): PaginationSearchParams => {
    return {
      page: Number(search?.page ?? 1),
      query: search.query ? search.query : undefined,
    };
  },
});

export function Users() {
  const pageLimit = 20;
  const { page, query } = usersListRoute.useSearch();
  const navigate = useNavigate({ from: usersListRoute.id });

  const { isLoading, isFetching, error, data } = trpc.user.users.useQuery(
    {
      offset: (page - 1) * pageLimit,
      show: pageLimit,
      query: !query ? undefined : query,
    },
    { placeholderData: keepPreviousData },
  );

  const setCurrentPage = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) });
  };

  const setQuery = (query: string) => {
    if (!query) {
      navigate({
        search: (prev) => ({ ...prev, query: undefined }),
      });
    } else {
      navigate({
        search: (prev) => ({ ...prev, query }),
      });
    }
  };

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Box>
      <Heading>Users</Heading>
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <InputGroup mb={4}>
        <InputLeftElement>
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search"
          value={query ?? ""}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && isFetching && (
          <InputRightElement>
            <Spinner />
          </InputRightElement>
        )}
      </InputGroup>
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Student</Th>
              <Th>Email Verified</Th>
              <Th>Beeping</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.users.map((user) => (
              <Tr key={user.id}>
                <TdUser user={user} />
                <Td>{user.email}</Td>
                <Td>
                  <Indicator color={user.isStudent ? "green" : "red"} />
                </Td>
                <Td>
                  <Indicator color={user.isEmailVerified ? "green" : "red"} />
                </Td>
                <Td>
                  <Indicator color={user.isBeeping ? "green" : "red"} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {isLoading && <Loading />}
      <Pagination
        resultCount={data?.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
