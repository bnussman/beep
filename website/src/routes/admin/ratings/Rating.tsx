import React from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DeleteRatingMutation, GetRatingQuery } from '../../../generated/graphql';
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Heading, Text, Box, Button, Flex, Spacer, Stack } from "@chakra-ui/react";
import { printStars } from ".";
import { Error } from '../../../components/Error';
import { BasicUser } from "../../../components/BasicUser";
import { DeleteDialog } from "../../../components/DeleteDialog";
import { DeleteIcon } from "@chakra-ui/icons";
import { Loading } from "../../../components/Loading";

dayjs.extend(relativeTime);

const DeleteRating = gql`
  mutation DeleteRating($id: String!) {
    deleteRating(id: $id)
  }
`;

const GetRating = gql`
  query GetRating($id: String!) {
    getRating(id: $id) {
      id
      message
      stars
      timestamp
      beep {
        id
      }
      rater {
        id
        name
        picture
        username
      }
      rated {
        id
        name
        picture
        username
      }
    }
  }
`;

export function Rating() {
  const { id } = useParams();
  const { data, loading, error } = useQuery<GetRatingQuery>(GetRating, { variables: { id: id } });
  const [deleteRating, { loading: deleteLoading }] = useMutation<DeleteRatingMutation>(DeleteRating);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  async function doDelete() {
    await deleteRating({ variables: { id: id } });
    navigate(-1);
  }

  return (
    <Box>
      <Flex align='center'>
        <Heading>Rating</Heading>
        <Spacer />
        <Button
          colorScheme="red"
          leftIcon={<DeleteIcon />}
          onClick={() => setIsOpen(true)}
        >
          Delete
        </Button>
      </Flex>

      {error && <Error error={error} />}
      {loading && <Loading />}

      {data?.getRating &&
        <Stack spacing={6}>
          <Box>
            <Heading size="lg">Rater</Heading>
            <BasicUser user={data.getRating.rater} />
          </Box>
          <Box>
            <Heading size="lg">Rated</Heading>
            <BasicUser user={data.getRating.rated} />
          </Box>
          <Box>
            <Heading size="lg">Stars</Heading>
            <Text>{printStars(data.getRating.stars)} {data.getRating.stars}</Text>
          </Box>
          <Box>
            <Heading size="lg">Message</Heading>
            <Text>{data.getRating.message}</Text>
          </Box>
          <Box>
            <Heading size="lg">Created</Heading>
            <Text>{dayjs().to(data.getRating.timestamp)}</Text>
          </Box>
          {data.getRating.beep &&
            <Box>
              <Heading size="lg">Beep</Heading>
              <NavLink to={`/admin/beeps/${data.getRating.beep.id}`}>
                {data.getRating.beep.id}
              </NavLink>
            </Box>
          }
        </Stack>
      }
      <DeleteDialog
        title="Rating"
        isOpen={isOpen}
        onClose={onClose}
        doDelete={doDelete}
        deleteLoading={deleteLoading}
        cancelRef={cancelRef}
      />
    </Box>
  );
}