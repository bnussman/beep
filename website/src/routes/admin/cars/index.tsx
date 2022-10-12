import React from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetCarsQuery } from '../../../generated/graphql';
import { Box, Heading, Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';
import { Indicator } from '../../../components/Indicator';

dayjs.extend(relativeTime);

export const CarsQuery = gql`
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
`;

export function Cars() {
  const pageLimit = 20;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;

  const { data, loading, error } = useQuery<GetCarsQuery>(CarsQuery, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const cars = data?.getCars.items;
  const count = data?.getCars.count;

  const setCurrentPage = (page: number) => {
    setSearchParams({ page: String(page) });
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
                  <Indicator color={car.color} />
                </Td>
                <Td>{dayjs().to(car.created)}</Td>
                <Td>
                  <Image src={car.photo} w="24" borderRadius="2xl" />
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
    </Box>
  );
}
