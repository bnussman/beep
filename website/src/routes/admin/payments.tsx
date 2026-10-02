import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../components/PaginationFooter";
import { TableCellUser } from "../../components/TableCellUser";
import { TableEmpty } from "../../components/TableEmpty";
import { TableLoading } from "../../components/TableLoading";
import { TableError } from "../../components/TableError";
import { Table } from "@heroui/react";
import {
  Stack,
  Typography,
} from "@mui/material";
import { orpc } from "../../utils/orpc";

export const Route = createFileRoute("/admin/payments")({
  component: Payments,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

function Payments() {
  const { page } = Route.useSearch();

  const navigate = useNavigate({ from: Route.id });

  const { data, isLoading, error } = useQuery(
    orpc.payment.payments.queryOptions({
      input: { page },
      placeholderData: keepPreviousData
    }),
  );

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h4" sx={{
        fontWeight: "bold"
      }}>
        Payments
      </Typography>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={page}
        onChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Payments" className="min-w-225">
            <Table.Header>
              <Table.Column>User</Table.Column>
              <Table.Column>Product</Table.Column>
              <Table.Column>Price</Table.Column>
              <Table.Column>Store</Table.Column>
              <Table.Column>Created</Table.Column>
              <Table.Column>Expires</Table.Column>
            </Table.Header>
            <Table.Body>
            {data?.results === 0 && <TableEmpty colSpan={6} />}
            {isLoading && <TableLoading colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {data?.payments.map((payment) => (
              <Table.Row key={payment.id}>
                <TableCellUser user={payment.user} />
                <Table.Cell>{payment.productId}</Table.Cell>
                <Table.Cell>${payment.price}</Table.Cell>
                <Table.Cell>{payment.store}</Table.Cell>
                <Table.Cell>
                  {new Date(payment.created).toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  {new Date(payment.expires).toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
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
