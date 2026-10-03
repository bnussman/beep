import React, { useState } from "react";
import { orpc } from "../../../../utils/orpc";
import { printStars } from "../../../../utils/utils";
import { createFileRoute } from "@tanstack/react-router"
import { PaginationFooter } from "../../../../components/PaginationFooter";
import { TableLoading } from "../../../../components/TableLoading";
import { TableError } from "../../../../components/TableError";
import { TableEmpty } from "../../../../components/TableEmpty";
import { TableCellUser } from "../../../../components/TableCellUser";
import { RatingMenu } from "../../../../components/RatingMenu";
import { DeleteRatingDialog } from "../../../../components/DeleteRatingDialog";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { Table } from "@heroui/react";

export const Route = createFileRoute("/admin/users/$userId/ratings")({
  component: RatingsTable,
});

function RatingsTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRatingId, setSelectedRatingId] = useState<string>();

  const { userId } = Route.useParams();

  const { data, isLoading, error } = useQuery(
    orpc.rating.ratings.queryOptions({
      input: {
        userId,
        page: currentPage,
        pageSize: 10,
      }
    })
  );

  return (
    <div className="flex flex-col gap-2">
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="User ratings" className="min-w-250">
            <Table.Header>
              <Table.Column isRowHeader>Rater</Table.Column>
              <Table.Column>Rated</Table.Column>
              <Table.Column>Message</Table.Column>
              <Table.Column>Stars</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {isLoading && <TableLoading colSpan={6} />}
            {error && <TableError colSpan={6} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={6} />}
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
        count={data?.pages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
      />
      <DeleteRatingDialog
        id={selectedRatingId}
        onClose={() => setSelectedRatingId(undefined)}
        isOpen={selectedRatingId !== undefined}
      />
    </div>
  );
}
