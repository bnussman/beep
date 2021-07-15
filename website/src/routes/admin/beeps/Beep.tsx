import { useHistory, useParams } from "react-router-dom";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from '../../../components/Card';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DeleteBeepMutation, GetBeepQuery } from '../../../generated/graphql';
import { Heading, Text, Box, Button, Flex, Spacer, Center, Spinner } from "@chakra-ui/react";
import React from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import BasicUser from "../../../components/BasicUser";
import { Error } from "../../../components/Error";
import DeleteDialog from "../../../components/DeleteDialog";
import { BeepsGraphQL } from ".";
import Loading from "../../../components/Loading";

dayjs.extend(duration);

const DeleteBeep = gql`
  mutation DeleteBeep($id: String!) {
    deleteBeep(id: $id)
  }
`;

const GetBeep = gql`
  query GetBeep($id: String!) {
    getBeep(id: $id) {
      id
      origin
      destination
      start
      end
      groupSize
      beeper {
        id
        name
        photoUrl
        username
      }
      rider {
        id
        name
        photoUrl
        username
      }
    }
  }
`;

function BeepPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery<GetBeepQuery>(GetBeep, { variables: { id } });
  const [deleteBeep, { loading: deleteLoading, error: deleteError }] = useMutation<DeleteBeepMutation>(DeleteBeep, { refetchQueries: () => ["getUsers"], awaitRefetchQueries: true });
  const history = useHistory();

  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  async function doDelete() {
    try {
      await deleteBeep({ variables: { id }, refetchQueries: [{ query: BeepsGraphQL }], awaitRefetchQueries: true });
      setIsOpen(false);
      history.goBack();
    }
    catch (error) {
      setIsOpen(false);
    }
  }

  return (
    <Box>
      {deleteError && <Error error={deleteError} />}
      <Flex align="center">
        <Heading>Beep</Heading>
        <Spacer />
        <Button
          colorScheme="red"
          leftIcon={<DeleteIcon />}
          onClick={() => setIsOpen(true)}
        >
          Delete
        </Button>
      </Flex>
      {loading && <Loading />}
      {data?.getBeep &&
        <Box>
          <iframe
            title="Map"
            width="100%"
            height="300"
            src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI&origin=${data.getBeep.origin}&destination=${data.getBeep.destination}`}>
          </iframe>
          <Card>
            <Heading>Beeper</Heading>
            <BasicUser user={data.getBeep.beeper} />
          </Card>
          <Card>
            <Heading>Rider</Heading>
            <BasicUser user={data.getBeep.rider} />
          </Card>
          <Card>
            <Heading>Origin</Heading>
            <Text>{data.getBeep.origin}</Text>
          </Card>
          <Card>
            <Heading>Destination</Heading>
            <Text>{data.getBeep.destination}</Text>
          </Card>
          <Card>
            <Heading>Group Size</Heading>
            <Text>{data.getBeep.groupSize}</Text>
          </Card>
          <Card>
            <Heading>Beep Started</Heading>
            <Text>{new Date(data.getBeep.start).toLocaleString()} - {dayjs().to(data.getBeep.start)}</Text>
          </Card>
          <Card>
            <Heading>Beep Ended</Heading>
            <Text>{new Date(data.getBeep.end).toLocaleString()} - {dayjs().to(data.getBeep.end)}</Text>
          </Card>
        </Box>
      }
      <DeleteDialog
        title="Beep"
        isOpen={isOpen}
        onClose={onClose}
        doDelete={doDelete}
        deleteLoading={deleteLoading}
        cancelRef={cancelRef}
      />
    </Box>
  );
}

export default BeepPage;
