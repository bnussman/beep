import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../../components/Pagination';
import { useQuery } from '@apollo/client';
import { Box, Heading, IconButton, Image, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { Indicator } from '../../../components/Indicator';
import { PhotoDialog } from '../../../components/PhotoDialog';
import { DeleteIcon } from '@chakra-ui/icons';
import { DeleteCarDialog } from './DeleteCarDialog';
import { Route, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { graphql } from '../../../graphql';

dayjs.extend(relativeTime);

export const CarsQuery = graphql(`
  query GetCars($offset: Int, $show: Int) {
    getCars(offset: $offset, show: $show) {
      items {
        id
        make
        model
        year
        color
        photo
        created
        user {
          id
          photo
          name
        }
      }
      count
    }
  }
`);

export const carsRoute = new Route({
  component: Cars,
  path: '/cars',
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => ({ page: Number(search?.page ?? 1)})
});

export function Cars() {
  const pageLimit = 20;

  const { page } = carsRoute.useSearch();

  const navigate = useNavigate({ from: carsRoute.id });

  const {
    isOpen: isPhotoOpen,
    onOpen: onPhotoOpen,
    onClose: onPhotoClose
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const [selectedCarId, setSelectedCarId] = useState<string>();

  const { data, loading, error } = useQuery(CarsQuery, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const cars = data?.getCars.items;
  const count = data?.getCars.count;

  const selectedCar = cars?.find(car => car.id === selectedCarId);

  const setCurrentPage = (page: number) => {
    navigate({ search: { page: page } });
  };


  const onDelete = (id: string) => {
    setSelectedCarId(id);
    onDeleteOpen();
  };

  const onPhotoClick = (id: string) => {
    setSelectedCarId(id);
    onPhotoOpen();
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Heading>Cars</Heading>
      <Pagination
        resultCount={count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Make</Th>
              <Th>Model</Th>
              <Th>Year</Th>
              <Th>Color</Th>
              <Th>Date</Th>
              <Th>Photo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cars && cars.map(car => (
              <Tr key={car.id}>
                <TdUser user={car.user} />
                <Td>{car.make}</Td>
                <Td>{car.model}</Td>
                <Td>{car.year}</Td>
                <Td>
                  <Indicator color={car.color} tooltip={car.color} />
                </Td>
                <Td>{dayjs().to(car.created)}</Td>
                <Td onClick={() => onPhotoClick(car.id)}>
                  <Image src={car.photo} borderRadius="lg" maxH="56px" />
                </Td>
                <Td>
                  <IconButton icon={<DeleteIcon />} aria-label={`Delete car ${car.id} action menu`} size="sm" colorScheme="red" onClick={() => onDelete(car.id)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {loading && <Loading />}
      <Pagination
        resultCount={count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <PhotoDialog
        src={selectedCar?.photo}
        isOpen={isPhotoOpen}
        onClose={onPhotoClose}
      />
      <DeleteCarDialog
        car={selectedCar}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
      />
    </Box>
  );
}
