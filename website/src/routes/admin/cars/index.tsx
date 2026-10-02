import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { CarMenu } from "../../../components/CarMenu";
import { DeleteCarDialog } from "../../../components/DeleteCarDialog";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { Indicator } from "../../../components/Indicator";
import { PhotoDialog } from "../../../components/PhotoDialog";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { TableCellUser } from "../../../components/TableCellUser";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { TableEmpty } from "../../../components/TableEmpty";
import { keepPreviousData } from "@tanstack/react-query";
import { Table, Typography } from "@heroui/react";
import {
  Box,
} from "@mui/material";

export const Route = createFileRoute("/admin/cars/")({
  component: Cars,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

function Cars() {
  const { page } = Route.useSearch();

  const navigate = useNavigate({ from: Route.id });

  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string>();

  const { data, isLoading, error } = useQuery(
    orpc.car.cars.queryOptions({
      input: { page },
      placeholderData: keepPreviousData
    }),
  );

  const selectedCar = data?.cars.find((car) => car.id === selectedCarId);

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page: page } });
  };

  const onDelete = (id: string) => {
    setSelectedCarId(id);
    setIsDeleteOpen(true);
  };

  const onPhotoClick = (id: string) => {
    setSelectedCarId(id);
    setIsPhotoOpen(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <Typography type="h1">
        Cars
      </Typography>
      <PaginationFooter
        results={data?.results}
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        onChange={setCurrentPage}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Cars" className="min-w-250">
            <Table.Header>
              <Table.Column>User</Table.Column>
              <Table.Column>Make</Table.Column>
              <Table.Column>Model</Table.Column>
              <Table.Column>Year</Table.Column>
              <Table.Column>Color</Table.Column>
              <Table.Column>Default</Table.Column>
              <Table.Column>Created</Table.Column>
              <Table.Column>Photo</Table.Column>
              <Table.Column />
            </Table.Header>
            <Table.Body>
            {isLoading && <TableLoading colSpan={9} />}
            {error && <TableError colSpan={9} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={9} />}
            {data?.cars.map((car) => (
              <Table.Row key={car.id}>
                <TableCellUser user={car.user} />
                <Table.Cell>{car.make}</Table.Cell>
                <Table.Cell>{car.model}</Table.Cell>
                <Table.Cell>{car.year}</Table.Cell>
                <Table.Cell>
                  <Indicator color={car.color} tooltip={car.color} />
                </Table.Cell>
                <Table.Cell>
                  <Indicator color={car.default ? "green" : "red"} />
                </Table.Cell>
                <Table.Cell>
                  {DateTime.fromJSDate(car.created).toRelative()}
                </Table.Cell>
                <Table.Cell onClick={() => onPhotoClick(car.id)}>
                  <Box
                    component="img"
                    src={car.photo}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      objectFit: "cover",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      ":hover": {
                        scale: "1.15",
                      },
                    }}
                  />
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
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        onChange={setCurrentPage}
      />
      <PhotoDialog
        src={selectedCar?.photo}
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
      />
      <DeleteCarDialog
        car={selectedCar}
        onClose={() => setIsDeleteOpen(false)}
        isOpen={isDeleteOpen}
      />
    </div>
  );
}
