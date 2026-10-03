import React from "react";
import { orpc } from "../../../utils/orpc";
import { Indicator } from "../../../components/Indicator";
import { beepStatusMap } from "../../../utils/utils";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableLoading } from "../../../components/TableLoading";
import { TableEmpty } from "../../../components/TableEmpty";
import { TableError } from "../../../components/TableError";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { BeepMenu } from "../../../components/BeepMenu";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Chip, Table, Typography } from "@heroui/react";

export const Route = createFileRoute("/admin/beeps/active")({
  component: ActiveBeeps,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
});

function ActiveBeeps() {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });

  const [parent] = useAutoAnimate();

  const { data, isLoading, error } = useQuery(
    orpc.beep.beeps.queryOptions({
      input: {
        page,
        inProgress: true,
      },
      refetchOnMount: true,
      refetchInterval: 3_000,
    }),
  );

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <Typography type="h1">
          Beeps
        </Typography>
        <Chip color="success" variant="soft">
          in progress
        </Chip>
      </div>
      <PaginationFooter
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        results={data?.results}
        onChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Active beeps" className="min-w-250">
            <Table.Header>
              <Table.Column>Beeper</Table.Column>
              <Table.Column>Rider</Table.Column>
              <Table.Column>Origin</Table.Column>
              <Table.Column>Destination</Table.Column>
              <Table.Column>Group Size</Table.Column>
              <Table.Column>Start Time</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body ref={data !== undefined ? parent : undefined}>
            {isLoading && <TableLoading colSpan={8} />}
            {error && <TableError colSpan={8} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={8} />}
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
                  {DateTime.fromJSDate(beep.start).toRelative()}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Indicator color={beepStatusMap[beep.status]} />
                    <Typography type="body" className="capitalize">
                      {beep.status.replaceAll("_", " ")}
                    </Typography>
                  </div>
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
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        results={data?.results}
        onChange={setCurrentPage}
      />
    </div>
  );
}
