import React, { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../routes/admin/users/User";
import { trpc } from "../utils/trpc";
import { PaginationFooter } from "./PaginationFooter";
import { TableLoading } from "./TableLoading";
import { TableError } from "./TableError";
import { TableEmpty } from "./TableEmpty";
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

export const paymentsTableRoute = createRoute({
  component: PaymentsTable,
  path: "payments",
  getParentRoute: () => userRoute,
});

export function PaymentsTable() {
  const { userId } = paymentsTableRoute.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, error } = trpc.payment.payments.useQuery({
    userId,
    page: currentPage,
    pageSize: 10,
  });

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
