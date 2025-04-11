import React, { useState } from "react";
import { Indicator } from "../../../components/Indicator";
import { PhotoDialog } from "../../../components/PhotoDialog";
import { DeleteIcon } from "@chakra-ui/icons";
import { DeleteCarDialog } from "./DeleteCarDialog";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { adminRoute } from "..";
import { trpc } from "../../../utils/trpc";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  IconButton,
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
import { TableCellUser } from "../../../components/TableCellUser";
import { PaginationFooter } from "../../../components/PaginationFooter";
import { Delete } from "@mui/icons-material";
import { TableLoading } from "../../../components/TableLoading";
import { TableError } from "../../../components/TableError";
import { TableEmpty } from "../../../components/TableEmpty";
import { keepPreviousData } from "@tanstack/react-query";

dayjs.extend(relativeTime);

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
                <TableCell>{dayjs().to(car.created)}</TableCell>
                <TableCell onClick={() => onPhotoClick(car.id)}>
                  <img
                    src={car.photo}
                    style={{ width: 64, height: 64, borderRadius: 10 }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <IconButton
                    aria-label={`Delete car ${car.id}`}
                    color="error"
                    onClick={() => onDelete(car.id)}
                  >
                    <Delete />
                  </IconButton>
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
