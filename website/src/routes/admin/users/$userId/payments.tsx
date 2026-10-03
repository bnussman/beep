import React, { useState } from "react";
import { orpc } from "../../../../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PaginationFooter } from "../../../../components/PaginationFooter";
import { TableLoading } from "../../../../components/TableLoading";
import { TableError } from "../../../../components/TableError";
import { TableEmpty } from "../../../../components/TableEmpty";
import { Table } from "@heroui/react";

export const Route = createFileRoute("/admin/users/$userId/payments")({
  component: PaymentsTable,
});

function PaymentsTable() {
  const { userId } = Route.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, error } = useQuery(
    orpc.payment.payments.queryOptions({
      input: {
        userId,
        page: currentPage,
        pageSize: 10,
      }
    }),
  );

  return (
    <div className="flex flex-col gap-2">
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={currentPage}
        onChange={(_e, page) => setCurrentPage(page)}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="User payments">
            <Table.Header>
              <Table.Column isRowHeader>RevenuCat ID</Table.Column>
              <Table.Column>Product ID</Table.Column>
              <Table.Column>Price</Table.Column>
              <Table.Column>Purchased</Table.Column>
              <Table.Column>Expires</Table.Column>
            </Table.Header>
            <Table.Body>
            {isLoading && <TableLoading colSpan={5} />}
            {error && <TableError colSpan={5} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={5} />}
            {data?.payments.map((payment) => (
              <Table.Row key={payment.id}>
                <Table.Cell>{payment.id}</Table.Cell>
                <Table.Cell>{payment.productId}</Table.Cell>
                <Table.Cell>{payment.price}</Table.Cell>
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
        page={currentPage}
        onChange={(_e, page) => setCurrentPage(page)}
      />
    </div>
  );
}
