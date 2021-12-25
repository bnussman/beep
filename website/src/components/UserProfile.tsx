import { NavLink, useParams, useNavigate } from 'react-router-dom';
import BeepsTable from './BeepsTable';
import QueueTable from './QueueTable';
import { UserRole } from '../types/User';
import { gql, useMutation } from '@apollo/client';
import { RemoveUserMutation, User } from '../generated/graphql';
import { printStars } from '../routes/admin/ratings';
import React, { useState } from 'react';
import DeleteDialog from './DeleteDialog';
import { DeleteIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocationView from '../routes/admin/users/Location';
import RatingsTable from './RatingsTable';
import ReportsTable from './ReportsTable';
import ClearQueueDialog from './ClearQueueDialog';
import { Error } from '../components/Error';
import {
  useToast,
  useDisclosure,
  Tooltip,
  Stack,
  AvatarBadge,
  Heading,
  Badge,
  Box,
  Text,
  Avatar,
  Button,
  Flex,
  Spacer,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/react';
import { Indicator } from './Indicator';

dayjs.extend(relativeTime);

const RemoveUser = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id)
  }
`;

const ClearQueue = gql`
  mutation ClearQueue($id: String!, $stopBeeping: Boolean!) {
    clearQueue(id: $id, stopBeeping: $stopBeeping)
  }
`;

interface Props {
  user: Partial<User>;
  admin?: boolean;
  refetch?: () => void;
}

const tabs = [
  'details',
  'location',
  'queue',
  'beeps',
  'ratings',
  'reports',
]

function UserProfile(props: Props) {
  const { user, admin, refetch } = props;

  const toast = useToast();
  const navigate = useNavigate();
  const { tab } = useParams();

  const [remove, { loading: isDeleteLoading, error: deleteError }] = useMutation<RemoveUserMutation>(RemoveUser);
  const [clear, { loading: isClearLoading, error: clearError }] = useMutation(ClearQueue);

  const [stopBeeping, setStopBeeping] = useState<boolean>(true);

  const cancelRefClear = React.useRef();
  const cancelRefDelete = React.useRef();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const {
    isOpen: isClearOpen,
    onOpen: onClearOpen,
    onClose: onClearClose
  } = useDisclosure();

  async function doDelete() {
    await remove({
      variables: { id: user.id },
      refetchQueries: () => ["getUsers"],
      awaitRefetchQueries: true
    });
    navigate(-1);
  }

  async function doClear() {
    try {
      await clear({
        variables: { id: user.id, stopBeeping }
      });
      if (refetch) refetch();
      onClearClose();
      toast({
        title: "Queue Cleared",
        description: `${user.name}'s queue has been cleared ${stopBeeping ? ' and they have stopped beeping.' : ''}`,
        status: "success",
      });
    }
    catch (e) {
      onClearClose();
    }
  }

  return (
    <>
      <Box>
        {deleteError && <Error error={deleteError} />}
        {clearError && <Error error={clearError} />}
        <Flex align="center">
          <Box>
            <Avatar
              src={user.photoUrl || ''}
              size="2xl"
            >
              {user.isBeeping && <AvatarBadge boxSize="1.0em" bg="green.500" />}
            </Avatar>
          </Box>
          <Box ml="4">
            <Heading size="md">{user.name}</Heading>
            <Text>@{user.username}</Text>
            <Text fontSize="xs">{user.id}</Text>
            {user.seen && (<Text fontSize="xs">Seen {dayjs().to(user.seen)}</Text>)}
            <Stack direction="row" mt="2" mb="2">
              {user.role === UserRole.ADMIN && <Badge variant="solid" colorScheme="red">admin</Badge>}
              {user.isStudent && <Badge variant="solid" colorScheme="blue">student</Badge>}
            </Stack>
          </Box>
          <Spacer />
          <Box>
            <NavLink to={admin ? `/admin/users/${user.id}/edit` : `/profile/edit`}>
              <Button m='1'>
                Edit
              </Button>
            </NavLink>
            {admin &&
              <Button
                m='1'
                colorScheme='blue'
                onClick={onClearOpen}
              >
                Clear Queue
              </Button>
            }
            {admin &&
              <Button
                m={1}
                colorScheme="red"
                leftIcon={<DeleteIcon />}
                onClick={onDeleteOpen}
              >
                Delete
              </Button>
            }
          </Box>
        </Flex>

        <Tabs
          isLazy
          mt="4"
          colorScheme="brand"
          lazyBehavior="keepMounted"
          defaultIndex={tab && tabs.indexOf(tab) !== -1 ? tabs.indexOf(tab) : 0}
          onChange={(index: number) => navigate(`/admin/users/${user.id}/${tabs[index].toLocaleLowerCase()}`)}
        >
          <TabList>
            {tabs.map((tab: string, idx) => <Tab key={idx} style={{ textTransform: 'capitalize' }}>{tab}</Tab>)}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack spacing={2}>
                <Box>
                  <strong>Rating:</strong>
                  {user.rating ?
                    <Text>
                      <Tooltip label={user.rating} aria-label={`User rating of ${user.rating}`}>
                        {printStars(user.rating)}
                      </Tooltip>
                    </Text>
                    :
                    <Text>
                      No Rating
                    </Text>
                  }
                </Box>
                <Box>
                  <strong>Email:</strong>
                  <Flex direction="row" alignItems="center">
                    <Text mr={2}>{user.email}</Text>
                    <Indicator color={user.isEmailVerified ? "green" : "red"} />
                  </Flex>
                </Box>
                <Box>
                  <strong>Phone:</strong>
                  <Text>{user.phone || ''}</Text>
                </Box>
                <Box>
                  <strong>Queue Size</strong>
                  <Text>{user.queueSize}</Text>
                </Box>
                <Box>
                  <strong>Capacity:</strong>
                  <Text>{user.capacity}</Text>
                </Box>
                <Box>
                  <strong>Rate:</strong>
                  <Text>${user.singlesRate} / ${user.groupRate}</Text>
                </Box>
                <Box>
                  <strong>Venmo usename:</strong>
                  <Text>{user.venmo || "N/A"}</Text>
                </Box>
                <Box>
                  <strong>CashApp usename:</strong>
                  <Text>{user.cashapp || "N/A"}</Text>
                </Box>
                <Box>
                  <strong>Masks:</strong>
                  <Text>
                    {user.masksRequired ? 'Masks required' : 'Masks not required'}
                  </Text>
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel>
              <LocationView user={user} />
            </TabPanel>
            <TabPanel>
              <QueueTable user={user} />
            </TabPanel>
            <TabPanel>
              <BeepsTable userId={user.id!} />
            </TabPanel>
            <TabPanel>
              <RatingsTable userId={user.id!} />
            </TabPanel>
            <TabPanel>
              <ReportsTable userId={user.id!} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <DeleteDialog
        title="User"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        doDelete={doDelete}
        deleteLoading={isDeleteLoading}
        cancelRef={cancelRefDelete}
      />
      <ClearQueueDialog
        isOpen={isClearOpen}
        onClose={onClearClose}
        onSubmit={doClear}
        isLoading={isClearLoading}
        cancelRef={cancelRefClear}
        stopBeeping={stopBeeping}
        setStopBeeping={setStopBeeping}
      />
    </>
  );
}

export default UserProfile;
