import { NavLink, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card } from '../../../components/Card';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DeleteRatingMutation, GetRatingQuery } from '../../../generated/graphql';
import React from "react";
import { Heading, Text, Box, Button, Flex, Spacer, Center, Spinner } from "@chakra-ui/react";
import { printStars } from ".";
import { Error } from '../../../components/Error';
import BasicUser from "../../../components/BasicUser";
import DeleteDialog from "../../../components/DeleteDialog";
import { DeleteIcon } from "@chakra-ui/icons";
import Loading from "../../../components/Loading";

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
        photoUrl
        username
      }
      rated {
        id
        name
        photoUrl
        username
      }
    }
  }
`;

function RatingPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetRatingQuery>(GetRating, { variables: { id: id } });
  const [deleteRating, { loading: deleteLoading }] = useMutation<DeleteRatingMutation>(DeleteRating);
  const history = useHistory();

  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  async function doDelete() {
    await deleteRating({ variables: { id: id } });
    history.goBack();
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
        <Box>
          <Card>
            <Heading>Rater</Heading>
            <BasicUser user={data.getRating.rater} />
          </Card>
          <Card>
            <Heading>Rated</Heading>
            <BasicUser user={data.getRating.rated} />
          </Card>
          <Card>
            <Heading>Stars</Heading>
            <Text>{printStars(data.getRating.stars)} {data.getRating.stars}</Text>
          </Card>
          <Card>
            <Heading>Message</Heading>
            <Text>{data.getRating.message}</Text>
          </Card>
          <Card>
            <Heading>Created</Heading>
            <Text>{dayjs().to(data.getRating.timestamp)}</Text>
          </Card>
          {data.getRating.beep &&
            <Card>
              <Heading>Associated Beep Event</Heading>
              <NavLink to={`/admin/beeps/${data.getRating.beep.id}`}>
                {data.getRating.beep.id}
              </NavLink>
            </Card>
          }
        </Box>
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

export default RatingPage;
