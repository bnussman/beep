import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Pagination } from './Pagination';
import { Box, Center, Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Loading } from './Loading';
import { GetCarsForUserQuery } from '../generated/graphql';
import { Indicator } from './Indicator';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface Props {
  userId: string;
}

const GetCarsForUser = gql`
  query GetCarsForUser($id: String, $offset: Int, $show: Int) {
    getCars(id: $id, offset: $offset, show: $show) {
      items {
        id
        make
        model
        year
        color
        photo
        created
        default
      }
      count
    }
  }
`;

export function CarsTable(props: Props) {
  const pageLimit = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, loading } = useQuery<GetCarsForUserQuery>(
    GetCarsForUser,
    {
      variables: {
        id: props.userId,
        offset: (currentPage - 1) * pageLimit,
        show: pageLimit 
      }
    }
  );

  const cars = data?.getCars.items;
  const count = data?.getCars.count;

  if (count === 0) {
    return (
      <Center h="100px">
        This user has no cars.
      </Center>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Pagination
        resultCount={count}
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
            </Tr>
          </Thead>
          <Tbody>
            {cars?.map((car) => (
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
                  <Indicator color={car.default ? 'green' : 'red'} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        resultCount={count}
        limit={pageLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}
