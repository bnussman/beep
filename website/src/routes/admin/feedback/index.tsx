import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { TableLoading } from "../../../components/TableLoading";
import { DeleteFeedbackDialog } from "../../../components/DeleteFeedbackDialog";
import { DateTime } from "luxon";
import { Button, Table, Typography } from "@heroui/react";
import { TrashIcon } from "@phosphor-icons/react";

export const Route = createFileRoute("/admin/feedback/")({
  component: Feedback,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

function Feedback() {
  const { page } = Route.useSearch();

  const navigate = useNavigate({ from: Route.id });
  const queryClient = useQueryClient();

  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string>();

  const { data, isLoading, error } = useQuery(
    orpc.feedback.feedback.queryOptions({
      input: { page },
      placeholderData: keepPreviousData,
    }),
  );

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  const selectedFeedback = data?.feedback.find(
    (f) => f.id === selectedFeedbackId,
  );

  return (
    <div className="flex flex-col gap-2">
      <Typography type="h1">
        Feedback
      </Typography>
      <PaginationFooter
        results={data?.results}
        pages={data?.pages}
        pageSize={data?.pageSize}
        page={page}
        onPageChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Feedback">
            <Table.Header>
              <Table.Column isRowHeader>User</Table.Column>
              <Table.Column>Message</Table.Column>
              <Table.Column>Created</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {data?.results === 0 && <TableEmpty colSpan={4} />}
            {isLoading && <TableLoading colSpan={4} />}
            {error && <TableError colSpan={4} error={error.message} />}
            {data?.feedback.map((feedback) => (
              <Table.Row key={feedback.id}>
                <TableCellUser user={feedback.user} />
                <Table.Cell>{feedback.message}</Table.Cell>
                <Table.Cell>
                  {DateTime.fromJSDate(feedback.created).toRelative()}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Button
                    isIconOnly
                    variant="danger"
                    aria-label={`Delete feeback ${feedback.id}`}
                    onClick={() => setSelectedFeedbackId(feedback.id)}
                  >
                    <TrashIcon />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <PaginationFooter
        results={data?.results}
        pages={data?.pages}
        pageSize={data?.pageSize}
        page={page}
        onPageChange={setCurrentPage}
      />
      <DeleteFeedbackDialog
        isOpen={selectedFeedback !== undefined}
        onClose={() => setSelectedFeedbackId(undefined)}
        feedback={selectedFeedback}
      />
    </div>
  );
}
