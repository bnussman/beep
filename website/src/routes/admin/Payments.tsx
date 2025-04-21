import React from "react";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from ".";
import { trpc } from "../../utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../components/PaginationFooter";
import { TableCellUser } from "../../components/TableCellUser";
import { TableEmpty } from "../../components/TableEmpty";
import { TableLoading } from "../../components/TableLoading";
import { TableError } from "../../components/TableError";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export const paymentsRoute = createRoute({
  component: Payments,
  path: "/payments",
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Payments() {
  const { page } = paymentsRoute.useSearch();

  const navigate = useNavigate({ from: paymentsRoute.id });

  const { data, isLoading, error } = trpc.payment.payments.useQuery(
    {
      page,
    },
    { placeholderData: keepPreviousData },
  );

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h4" fontWeight="bold">
        Payments
      </Typography>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={page}
        onChange={setCurrentPage}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.results === 0 && <TableEmpty colSpan={6} />}
            {isLoading && <TableLoading colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {data?.payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCellUser user={payment.user} />
                <TableCell>{payment.productId}</TableCell>
                <TableCell>${payment.price}</TableCell>
                <TableCell>{payment.store}</TableCell>
                <TableCell>
                  {new Date(payment.created).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(payment.expires).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={page}
        onChange={setCurrentPage}
      />
    </Stack>
  );
}
