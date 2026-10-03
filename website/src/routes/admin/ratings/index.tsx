import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { printStars } from "../../../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { TableCellUser } from "../../../components/TableCellUser";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { RatingMenu } from "../../../components/RatingMenu";
import { DeleteRatingDialog } from "../../../components/DeleteRatingDialog";
import { TableEmpty } from "../../../components/TableEmpty";
import { keepPreviousData } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { Table, Typography } from "@heroui/react";

export const Route = createFileRoute("/admin/ratings/")({
  component: Ratings,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

function Ratings() {
  const { page } = Route.useSearch();

  const navigate = useNavigate({ from: Route.id });

  const { data, isLoading, error } = useQuery(
    orpc.rating.ratings.queryOptions({
      input: { page },
      placeholderData: keepPreviousData
    }),
  );

  const [selectedRatingId, setSelectedRatingId] = useState<string>();

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <div className="flex flex-col gap-2">
      <Typography type="h1">
        Ratings
      </Typography>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        page={page}
        count={data?.pages}
        onChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Ratings">
            <Table.Header>
              <Table.Column isRowHeader>Rater</Table.Column>
              <Table.Column>Rated</Table.Column>
              <Table.Column>Message</Table.Column>
              <Table.Column>Stars</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {data?.results === 0 && <TableEmpty colSpan={6} />}
            {isLoading && <TableLoading colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {data?.ratings.map((rating) => (
              <Table.Row key={rating.id}>
                <TableCellUser user={rating.rater} />
                <TableCellUser user={rating.rated} />
                <Table.Cell>{rating.message ?? "N/A"}</Table.Cell>
                <Table.Cell>{printStars(rating.stars)}</Table.Cell>
                <Table.Cell>
                  {DateTime.fromJSDate(rating.timestamp).toRelative()}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <RatingMenu
                    ratingId={rating.id}
                    onDelete={() => setSelectedRatingId(rating.id)}
                  />
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
        page={page}
        count={data?.pages}
        onChange={setCurrentPage}
      />
      <DeleteRatingDialog
        id={selectedRatingId}
        isOpen={selectedRatingId !== undefined}
        onClose={() => setSelectedRatingId(undefined)}
      />
    </div>
  );
}
