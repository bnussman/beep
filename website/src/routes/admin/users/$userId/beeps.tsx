import React, { useState } from "react";
import { orpc } from "../../../../utils/orpc";
import { beepStatusToChipColorMap } from "../../../../utils/utils";
import { DateTime, Duration } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { BeepMenu } from "../../../../components/BeepMenu";
import { createFileRoute } from "@tanstack/react-router";
import { PaginationFooter } from "../../../../components/PaginationFooter";
import { TableCellUser } from "../../../../components/TableCellUser";
import { TableLoading } from "../../../../components/TableLoading";
import { TableError } from "../../../../components/TableError";
import { TableEmpty } from "../../../../components/TableEmpty";
import { Chip, Table } from "@heroui/react";

export const Route = createFileRoute("/admin/users/$userId/beeps")({
  component: BeepsTable,
});

function BeepsTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userId } = Route.useParams();

  const { data, isLoading, error } = useQuery(
    orpc.beep.beeps.queryOptions({
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
        pageSize={data?.pageSize}
        pages={data?.pages}
        page={currentPage}
        onPageChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="User beeps">
            <Table.Header>
              <Table.Column isRowHeader>Beeper</Table.Column>
              <Table.Column>Rider</Table.Column>
              <Table.Column>Origin</Table.Column>
              <Table.Column>Destination</Table.Column>
              <Table.Column>Group Size</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Duration</Table.Column>
              <Table.Column>Started</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {isLoading && <TableLoading colSpan={9} />}
            {error && <TableError colSpan={9} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={9} />}
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
                    className="capitalize"
                    color={beepStatusToChipColorMap[beep.status]}
                  >
                    {beep.status.replaceAll("_", " ")}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  {beep.end
                    ? Duration.fromMillis(
                        new Date(beep.end).getTime() -
                          new Date(beep.start).getTime(),
                      )
                        .rescale()
                        .toHuman()
                    : "Still in progress"}
                </Table.Cell>
                <Table.Cell>
                  {DateTime.fromJSDate(beep.start).toRelative()}
                </Table.Cell>
                <Table.Cell>
                  <BeepMenu beepId={beep.id} />
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize}
        pages={data?.pages}
        page={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
