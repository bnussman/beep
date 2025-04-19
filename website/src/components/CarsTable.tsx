import React, { useState } from "react";
import { Indicator } from "./Indicator";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../routes/admin/users/User";
import { trpc } from "../utils/trpc";
import { DeleteCarDialog } from "../routes/admin/cars/DeleteCarDialog";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  Stack,
  TableCell,
} from "@mui/material";
import { PaginationFooter } from "./PaginationFooter";
import { CarMenu } from "../routes/admin/cars/CarMenu";
import { TableLoading } from "./TableLoading";
import { TableEmpty } from "./TableEmpty";
import { TableError } from "./TableError";
import { keepPreviousData } from "@tanstack/react-query";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const carsTableRoute = createRoute({
  component: CarsTable,
  path: "cars",
  getParentRoute: () => userRoute,
});

export function CarsTable() {
  const pageLimit = 5;
  const { userId } = carsTableRoute.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCarId, setSelectedCarId] = useState<string>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, error } = trpc.car.cars.useQuery(
    {
      userId,
      cursor: currentPage,
      pageSize: pageLimit,
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  const selectedCar = data?.cars.find((car) => car.id === selectedCarId);

  const onDelete = (id: string) => {
    setSelectedCarId(id);
    setIsDeleteOpen(true);
  };

  return (
    <Stack spacing={1}>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        count={data?.pages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>Default</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableLoading colSpan={8} />}
            {error && <TableError colSpan={8} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={8} />}
            {data?.cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>{car.make}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>
                  <Indicator color={car.color} tooltip={car.color} />
                </TableCell>
                <TableCell>{dayjs().to(car.created)}</TableCell>
                <TableCell>
                  <img
                    src={car.photo}
                    style={{ width: 24, borderRadius: 10 }}
                  />
                </TableCell>
                <TableCell>
                  <Indicator color={car.default ? "green" : "red"} />
                </TableCell>
                <TableCell>
                  <CarMenu carId={car.id} onDelete={() => onDelete(car.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Stack>
  );
}
