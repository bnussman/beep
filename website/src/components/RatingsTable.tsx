import React, { useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Pagination } from "./Pagination";
import {
  Box,
  Center,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { TdUser } from "./TdUser";
import { printStars } from "../routes/admin/ratings";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link, createRoute } from "@tanstack/react-router";
import { userRoute } from "../routes/admin/users/User";
import { trpc } from "../utils/trpc";

dayjs.extend(duration);

export const ratingsTableRoute = createRoute({
  component: RatingsTable,
  path: "ratings",
  getParentRoute: () => userRoute,
});

export function RatingsTable() {
  const pageLimit = 5;

  const { userId } = ratingsTableRoute.useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading } = trpc.rating.ratings.useQuery({
    userId,
    cursor: currentPage,
    pageSize: pageLimit,
  });

  if (data?.results === 0) {
    return <Center h="100px">This user has no ratings.</Center>;
  }

  if (isLoading) {
    return (
      <Center h="100px">
        <Spinner size="xl" />
      </Center>
    );
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
              <Th>Rater</Th>
              <Th>Rated</Th>
              <Th>Message</Th>
              <Th>Stars</Th>
              <Th>Date</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.ratings.map((rating) => (
              <Tr key={rating.id}>
                <TdUser user={rating.rater} />
                <TdUser user={rating.rated} />
                <Td>{rating.message ?? "N/A"}</Td>
                <Td>{printStars(rating.stars)}</Td>
                <Td>{dayjs().to(rating.timestamp)}</Td>
                <Td>
                  <Link
                    to="/admin/ratings/$ratingId"
                    params={{ ratingId: rating.id }}
                  >
                    <ExternalLinkIcon />
                  </Link>
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
    </Box>
  );
}
