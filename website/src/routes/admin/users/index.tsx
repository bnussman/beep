import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { orpc } from "../../../utils/orpc";
import { Indicator } from "../../../components/Indicator";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { usersRoute } from "./routes";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { useQuery } from "@tanstack/react-query";
import { TableEmpty } from "../../../components/TableEmpty";
import {
  createRoute,
  Link as RouterLink,
  useNavigate,
} from "@tanstack/react-router";
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
  Link,
} from "@mui/material";

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

  const { isLoading, isFetching, error, data } = useQuery(
    orpc.user.users.queryOptions(
      {
        input: {
        page,
        pageSize: PAGE_SIZE,
        query: !query ? undefined : query,
        },
        placeholderData: keepPreviousData 
      },
    ),
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

  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">
        Users
      </Typography>
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
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
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
              {data?.results === 0 && <TableEmpty colSpan={5} />}
              {isLoading && <TableLoading colSpan={5} />}
              {error && <TableError colSpan={5} error={error.message} />}
              {data?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link component={RouterLink} to={`/admin/users/${user.id}`}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={user.photo ?? undefined} />
                        <Typography>
                          {user.first} {user.last}
                        </Typography>
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
