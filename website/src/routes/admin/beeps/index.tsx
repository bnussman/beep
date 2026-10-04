import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { beepStatusToChipColorMap } from "../../../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { BeepMenu } from "../../../components/BeepMenu";
import { DeleteBeepDialog } from "../../../components/DeleteBeepDialog";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableError } from "../../../components/TableError";
import { TableLoading } from "../../../components/TableLoading";
import { TableEmpty } from "../../../components/TableEmpty";
import { DateTime, Interval } from "luxon";
import { Chip, Table, Typography } from "@heroui/react";

export const Route = createFileRoute("/admin/beeps/")({
  component: Beeps,
  validateSearch: (search) => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
});

function Beeps() {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBeepId, setSelectedBeepId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery(
    orpc.beep.beeps.queryOptions({
      input: { page },
      refetchInterval: 5_000,
      refetchOnMount: true,
      placeholderData: keepPreviousData,
    }),
  );

  const setCurrentPage = (page: number) => {
    navigate({ search: { page } });
  };

  return (
    <div className="flex flex-col gap-2">
      <Typography type="h1">
        Beeps
      </Typography>
      <PaginationFooter
        page={page}
        pages={data?.pages}
        pageSize={data?.pageSize}
        results={data?.results}
        onPageChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Beeps">
            <Table.Header>
              <Table.Column>Beeper</Table.Column>
              <Table.Column isRowHeader>Rider</Table.Column>
              <Table.Column>Origin</Table.Column>
              <Table.Column>Destination</Table.Column>
              <Table.Column>Group</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Start</Table.Column>
              <Table.Column>End</Table.Column>
              <Table.Column>Duration</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {error && <TableError colSpan={10} error="Unable to fetch beeps" />}
            {isLoading && <TableLoading colSpan={10} />}
            {data?.results === 0 && <TableEmpty colSpan={10} />}
            {data?.beeps.map((beep) => (
              <Table.Row key={beep.id}>
                <TableCellUser
                  user={beep.beeper}
                  linkProps={{ to: "/admin/users/$userId/queue" }}
                />
                <TableCellUser
                  user={beep.rider}
                  linkProps={{ to: "/admin/users/$userId/ride" }}
                />
                <Table.Cell>{beep.origin}</Table.Cell>
                <Table.Cell>{beep.destination}</Table.Cell>
                <Table.Cell>{beep.groupSize}</Table.Cell>
                <Table.Cell>
                  <Chip
                    className="capitalize whitespace-nowrap"
                    color={beepStatusToChipColorMap[beep.status]}
                  >
                    {beep.status.replaceAll("_", " ")}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  {DateTime.fromJSDate(beep.start).toRelative()}
                </Table.Cell>
                <Table.Cell>
                  {beep.end ? DateTime.fromJSDate(beep.end).toRelative() : "N/A"}
                </Table.Cell>
                <Table.Cell>
                  {beep.end
                    ? Interval.fromDateTimes(
                        DateTime.fromJSDate(beep.start),
                        DateTime.fromJSDate(beep.end),
                      )
                        .toDuration()
                        .rescale()
                        .set({ milliseconds: 0 })
                        .rescale()
                        .toHuman()
                    : "N/A"}
                </Table.Cell>
                <Table.Cell>
                  <BeepMenu
                    beepId={beep.id}
                    onDelete={() => {
                      setIsDeleteOpen(true);
                      setSelectedBeepId(beep.id);
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <PaginationFooter
        page={page}
        pages={data?.pages}
        pageSize={data?.pageSize}
        results={data?.results}
        onPageChange={setCurrentPage}
      />
      <DeleteBeepDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        id={selectedBeepId ?? ""}
      />
    </div>
  );
}
