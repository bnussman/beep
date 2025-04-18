import React, { useState } from "react";
import { Pagination } from "./Pagination";
import { Loading } from "./Loading";
import { Indicator } from "./Indicator";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../routes/admin/users/User";
import { trpc } from "../utils/trpc";
import { DeleteCarDialog } from "../routes/admin/cars/DeleteCarDialog";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

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

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.car.cars.useQuery({
    userId,
    cursor: currentPage,
    pageSize: pageLimit,
  });

  const { mutateAsync: updateCar } = trpc.car.updateCar.useMutation({
    onSuccess() {
      utils.car.cars.invalidate();
    },
  });

  const selectedCar = data?.cars.find((car) => car.id === selectedCarId);

  const onDelete = (id: string) => {
    setSelectedCarId(id);
    onDeleteOpen();
  };

  if (data?.results === 0) {
    return <Center h="100px">This user has no cars.</Center>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Pagination
        resultCount={data?.results}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Make</Th>
              <Th>Model</Th>
              <Th>Year</Th>
              <Th>Color</Th>
              <Th>Created</Th>
              <Th>Photo</Th>
              <Th>Default</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.cars.map((car) => (
              <Tr key={car.id}>
                <Td>{car.make}</Td>
                <Td>{car.model}</Td>
                <Td>{car.year}</Td>
                <Td>
                  <Indicator color={car.color} tooltip={car.color} />
                </Td>
                <Td>{dayjs().to(car.created)}</Td>
                <Td>
                  <Image src={car.photo} w="24" borderRadius="2xl" />
                </Td>
                <Td>
                  <Indicator color={car.default ? "green" : "red"} />
                </Td>
                <Td>
                  <Menu isLazy>
                    <MenuButton
                      as={IconButton}
                      icon={<HamburgerIcon />}
                      size="sm"
                      aria-label={`Action menu for car ${car.id}`}
                    >
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() =>
                          updateCar({ carId: car.id, data: { default: true } })
                        }
                      >
                        Make Default
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(car.id)}>
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        resultCount={data?.results}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <DeleteCarDialog
        car={selectedCar}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
      />
    </Box>
  );
}
