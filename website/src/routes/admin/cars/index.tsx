import React, { useState } from "react";
import { DateTime } from "luxon";
import { Indicator } from "../../../components/Indicator";
import { PhotoDialog } from "../../../components/PhotoDialog";
import { DeleteCarDialog } from "./DeleteCarDialog";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { trpc } from "../../../utils/trpc";
import { TableCellUser } from "../../../components/TableCellUser";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { TableEmpty } from "../../../components/TableEmpty";
import { keepPreviousData } from "@tanstack/react-query";
import { CarMenu } from "./CarMenu";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export const carsRoute = createRoute({
  component: Cars,
  path: "/cars",
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Cars() {
  const { page } = carsRoute.useSearch();

  const navigate = useNavigate({ from: carsRoute.id });

  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string>();

  const { data, isLoading, error } = trpc.car.cars.useQuery(
    {
      cursor: page,
    },
    { placeholderData: keepPreviousData },
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
    <Stack spacing={1}>
      <Typography variant="h4" fontWeight="bold">
        Cars
      </Typography>
      <PaginationFooter
        results={data?.results}
        count={data?.pages}
        pageSize={data?.pageSize ?? 0}
        page={page}
        onChange={setCurrentPage}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Default</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableLoading colSpan={8} />}
            {error && <TableError colSpan={8} error={error.message} />}
            {data?.results === 0 && <TableEmpty colSpan={8} />}
            {data?.cars.map((car) => (
              <TableRow key={car.id}>
                <TableCellUser user={car.user} />
                <TableCell>{car.make}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>
                  <Indicator color={car.color} tooltip={car.color} />
                </TableCell>
                <TableCell>
                  <Indicator color={car.default ? "green" : "red"} />
                </TableCell>
                <TableCell>
                  {DateTime.fromISO(car.created).toRelative()}
                </TableCell>
                <TableCell onClick={() => onPhotoClick(car.id)}>
                  <Box
                    component="img"
                    src={car.photo}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      objectFit: "cover",
                      cursor: 'pointer',
                      transition: "all 0.2s ease-in-out",
                      ':hover': {
                        scale: '1.15'
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <CarMenu carId={car.id} onDelete={() => onDelete(car.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Stack>
  );
}
