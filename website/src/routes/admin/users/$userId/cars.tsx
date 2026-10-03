import React, { useState } from "react";
import { orpc } from "../../../../utils/orpc";
import { CarMenu } from "../../../../components/CarMenu";
import { useQuery } from "@tanstack/react-query";
import { DeleteCarDialog } from "../../../../components/DeleteCarDialog";
import { DateTime } from "luxon";
import { Indicator } from "../../../../components/Indicator";
import { createFileRoute } from "@tanstack/react-router";
import { PaginationFooter } from "../../../../components/PaginationFooter";
import { TableLoading } from "../../../../components/TableLoading";
import { TableEmpty } from "../../../../components/TableEmpty";
import { TableError } from "../../../../components/TableError";
import { keepPreviousData } from "@tanstack/react-query";
import { Table } from "@heroui/react";

export const Route = createFileRoute("/admin/users/$userId/cars")({
  component: CarsTable,
});

function CarsTable() {
  const { userId } = Route.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCarId, setSelectedCarId] = useState<string>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, error } = useQuery(
    orpc.car.cars.queryOptions({
      input: {
        userId,
        page: currentPage,
        pageSize: 10,
      },
      placeholderData: keepPreviousData,
    }),
  );

  const selectedCar = data?.cars.find((car) => car.id === selectedCarId);

  const onDelete = (id: string) => {
    setSelectedCarId(id);
    setIsDeleteOpen(true);
  };

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
          <Table.Content aria-label="User cars">
            <Table.Header>
              <Table.Column>Make</Table.Column>
              <Table.Column isRowHeader>Model</Table.Column>
              <Table.Column>Year</Table.Column>
              <Table.Column>Color</Table.Column>
              <Table.Column>Created</Table.Column>
              <Table.Column>Photo</Table.Column>
              <Table.Column>Default</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {isLoading && <TableLoading colSpan={8} />}
            {error && <TableError colSpan={8} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={8} />}
            {data?.cars.map((car) => (
              <Table.Row key={car.id}>
                <Table.Cell>{car.make}</Table.Cell>
                <Table.Cell>{car.model}</Table.Cell>
                <Table.Cell>{car.year}</Table.Cell>
                <Table.Cell>
                  <Indicator color={car.color} tooltip={car.color} />
                </Table.Cell>
                <Table.Cell>
                  {DateTime.fromJSDate(car.created).toRelative()}
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={car.photo}
                    alt={`${car.user.first}'s ${car.year} ${car.make} ${car.model}`}
                    style={{ width: 84, borderRadius: 10 }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Indicator color={car.default ? "green" : "red"} />
                </Table.Cell>
                <Table.Cell className="text-right">
                  <CarMenu carId={car.id} onDelete={() => onDelete(car.id)} />
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
      <DeleteCarDialog
        car={selectedCar}
        onClose={() => setIsDeleteOpen(false)}
        isOpen={isDeleteOpen}
      />
    </div>
  );
}
