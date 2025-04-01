import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  Stack,
  InputAdornment,
  TableContainer,
  Paper,
  TextField,
  Avatar,
} from "@mui/material";
import { Indicator } from "../../../components/Indicator";
import { Error } from "../../../components/Error";
import { Loading } from "../../../components/Loading";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../../utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { usersRoute } from "./routes";

export interface PaginationSearchParams {
  page: number;
  query?: string;
}

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

function Users() {
  const PAGE_SIZE = 20;
  const { page, query } = usersListRoute.useSearch();
  const navigate = useNavigate({ from: usersListRoute.id });

  const { isLoading, isFetching, error, data } = trpc.user.users.useQuery(
    {
      page,
      pageSize: PAGE_SIZE,
      query: !query ? undefined : query,
    },
    { placeholderData: keepPreviousData },
  );

  const setCurrentPage = (event: React.ChangeEvent<unknown>, page: number) => {
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

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">Users</Typography>
      <Stack spacing={1}>
        <PaginationFooter
          pageSize={PAGE_SIZE}
          results={data?.results}
          count={data?.pages}
          page={page}
          onChange={setCurrentPage}
        />
        <TextField
          size="small"
          type="text"
          placeholder="Search"
          value={query ?? ""}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              endAdornment: isFetching && (
                <InputAdornment position="end">
                  <CircularProgress size="16px" />
                </InputAdornment>
              )
            }
          }}
        />
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Email Verified</TableCell>
                <TableCell>Beeping</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to="/admin/users/$userId" params={{ userId: user.id }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={user.photo ?? undefined} />
                        <Typography>{user.first} {user.last}</Typography>
                      </Stack>
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Indicator color={user.isStudent ? "green" : "red"} />
                  </TableCell>
                  <TableCell>
                    <Indicator color={user.isEmailVerified ? "green" : "red"} />
                  </TableCell>
                  <TableCell>
                    <Indicator color={user.isBeeping ? "green" : "red"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isLoading && <Loading />}
        <PaginationFooter
          pageSize={PAGE_SIZE}
          results={data?.results}
          count={data?.pages}
          page={page}
          onChange={setCurrentPage}
        />
      </Stack>
    </Stack>
  );
}
