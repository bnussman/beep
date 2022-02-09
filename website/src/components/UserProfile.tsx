import React, { useState } from 'react';
import BeepsTable from './BeepsTable';
import QueueTable from './QueueTable';
import DeleteDialog from './DeleteDialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocationView from '../routes/admin/users/Location';
import RatingsTable from './RatingsTable';
import ReportsTable from './ReportsTable';
import ClearQueueDialog from './ClearQueueDialog';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UserRole } from '../types/User';
import { gql, useMutation } from '@apollo/client';
import { RemoveUserMutation, User, VerifyUserMutation } from '../generated/graphql';
import { printStars } from '../routes/admin/ratings';
import { DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { Error } from '../components/Error';
import { Indicator } from './Indicator';
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
import { GetUser } from '../routes/admin/users/User';
import { UsersGraphQL } from '../routes/admin/users';
import SendNotificationDialog from './SendNotificationDialog';

dayjs.extend(relativeTime);

const RemoveUser = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id)
  }
`;

const VerifyUser = gql`
  mutation VerifyUser($id: String!, $data: EditUserValidator!) {
    editUser(id: $id, data: $data) {
      username
    }
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
  const [verify, { loading: isVerifyLoading, error: verifyError }] = useMutation<VerifyUserMutation>(VerifyUser);

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

  const {
    isOpen: isSendNotificationOpen,
    onOpen: onSendNotificationOpen,
    onClose: onSendNotificationClose
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

  const onVerify = () => {
    verify({
      variables: { id: user.id, data: { isEmailVerified: true, isStudent: true } },
      refetchQueries: [UsersGraphQL, GetUser],
      awaitRefetchQueries: false
    }).then(() => {
      toast({ title: "User verified", status: "success" });
    });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Box>
        {deleteError && <Error error={deleteError} />}
        {clearError && <Error error={clearError} />}
        {verifyError && <Error error={verifyError} />}
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
            {user.created && (<Text fontSize="xs">Joined {dayjs().to(user.created)}</Text>)}
            <Stack direction="row" mt="2" mb="2">
              {user.role === UserRole.ADMIN && <Badge variant="solid" colorScheme="red">admin</Badge>}
              {user.isStudent && <Badge variant="solid" colorScheme="blue">student</Badge>}
            </Stack>
          </Box>
          <Spacer />
          <Box textAlign="right">
            <NavLink to={admin ? `/admin/users/${user.id}/edit` : `/profile/edit`}>
              <Button m='1'>
                Edit
              </Button>
            </NavLink>
            {admin && !user.isEmailVerified &&
              <Button
                m={1}
                colorScheme="green"
                leftIcon={<CheckIcon />}
                onClick={onVerify}
                isLoading={isVerifyLoading}
              >
                Verify
              </Button>
            }
            {admin &&
              <Button
                m={1}
                colorScheme="purple"
                onClick={onSendNotificationOpen}
                isDisabled={!user?.pushToken}
              >
                Send Notification
              </Button>
            }
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
          index={tab && tabs.indexOf(tab) !== -1 ? tabs.indexOf(tab) : 0}
          onChange={(index: number) => navigate(`/admin/users/${user.id}/${tabs[index].toLocaleLowerCase()}`)}
        >
          <TabList>
            {tabs.map((tab: string, idx) => <Tab key={idx} style={{ textTransform: 'capitalize' }}>{tab}</Tab>)}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack spacing={2}>
                <Box>
                  <strong>Email:</strong>
                  <Flex direction="row" alignItems="center">
                    <Indicator mr={2} color={user.isEmailVerified ? "green" : "red"} />
                    <Text>{user.email}</Text>
                  </Flex>
                </Box>
                <Box>
                  <strong>Push Notification Token:</strong>
                  <Flex direction="row" alignItems="center">
                    <Indicator mr={2} color={user.pushToken ? "green" : "red"} />
                    <Text>{user.pushToken || "N/A"}</Text>
                  </Flex>
                </Box>
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
                  <strong>Phone:</strong>
                  <Text>{user.phone || ''}</Text>
                </Box>
                <Box>
                  <strong>Queue Size:</strong>
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
      <SendNotificationDialog
        id={user.id}
        isOpen={isSendNotificationOpen}
        onClose={onSendNotificationClose}
      />
    </>
  );
}

export default UserProfile;
