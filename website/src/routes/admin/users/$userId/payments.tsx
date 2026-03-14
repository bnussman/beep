import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../../../../utils/trpc";
import { PaginationFooter } from "../../../../components/PaginationFooter";
import { TableLoading } from "../../../../components/TableLoading";
import { TableError } from "../../../../components/TableError";
import { TableEmpty } from "../../../../components/TableEmpty";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const Route = createFileRoute('/admin/users/$userId/payments')({
  component: PaymentsTable,
});

function PaymentsTable() {
  const trpc = useTRPC();
  const { userId } = Route.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, error } = useQuery(trpc.payment.payments.queryOptions({
    userId,
    page: currentPage,
    pageSize: 10,
  }));

  return (
    <Stack spacing={1}>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={currentPage}
        onChange={(_e, page) => setCurrentPage(page)}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>RevenuCat ID</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Purchased</TableCell>
              <TableCell>Expires</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableLoading colSpan={5} />}
            {error && <TableError colSpan={5} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={5} />}
            {data?.payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.productId}</TableCell>
                <TableCell>{payment.price}</TableCell>
                <TableCell>{payment.created}</TableCell>
                <TableCell>{payment.expires}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={currentPage}
        onChange={(_e, page) => setCurrentPage(page)}
      />
    </Stack>
  );
}
