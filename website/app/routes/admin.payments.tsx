import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTRPC } from "../../src/utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../src/components/PaginationFooter";
import { TableCellUser } from "../../src/components/TableCellUser";
import { TableEmpty } from "../../src/components/TableEmpty";
import { TableLoading } from "../../src/components/TableLoading";
import { TableError } from "../../src/components/TableError";
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

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/payments")({
  component: Payments,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Payments() {
  const trpc = useTRPC();
  const { page } = Route.useSearch();

  const navigate = useNavigate({ from: Route.id });

  const { data, isLoading, error } = useQuery(trpc.payment.payments.queryOptions(
    {
      page,
    },
    { placeholderData: keepPreviousData },
  ));

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
