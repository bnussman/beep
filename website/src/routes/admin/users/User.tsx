import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Loading } from '../../../components/Loading';
import { BeepsTable } from '../../../components/BeepsTable';
import { QueueTable } from '../../../components/QueueTable';
import { DeleteDialog } from '../../../components/DeleteDialog';
import { LocationView } from '../../../routes/admin/users/Location';
import { RatingsTable } from '../../../components/RatingsTable';
import { ReportsTable } from '../../../components/ReportsTable';
import { ClearQueueDialog } from '../../../components/ClearQueueDialog';
import { SendNotificationDialog } from '../../../components/SendNotificationDialog';
import { Details } from '../../../routes/admin/users/Details';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UserRole } from '../../../types/User';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GetUserQuery, VerifyUserMutation } from '../../../generated/graphql';
import { DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { Error } from '../../../components/Error';
import { PhotoDialog } from '../../../components/PhotoDialog';
import {
  useToast,
  useDisclosure,
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
  TabPanels,
  useMediaQuery
} from '@chakra-ui/react';
import { CarsTable } from '../../../components/CarsTable';
import { DeleteUserDialog } from './DeleteUserDialog';

dayjs.extend(relativeTime);

export const GetUser = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      id
      name
      first
      last
      isBeeping
      isStudent
      isEmailVerified
      role
      venmo
      cashapp
      singlesRate
      groupRate
      capacity
      photo
      queueSize
      phone
      username
      rating
      email
      created
      pushToken
      location {
        latitude
        longitude
      }
      queue {
        id
        origin
        destination
        start
        groupSize
        status
        rider {
          id
          photo
          username
          first
          last
          name
        }
      }
    }
  }
`;

const VerifyUser = gql`
  mutation VerifyUser($id: String!, $data: EditUserInput!) {
    editUser(id: $id, data: $data) {
      id
      isEmailVerified
      isStudent
    }
  }
`;

const ClearQueue = gql`
  mutation ClearQueue($id: String!, $stopBeeping: Boolean!) {
    clearQueue(id: $id, stopBeeping: $stopBeeping)
  }
`;

const tabs = [
  'details',
  'location',
  'queue',
  'beeps',
  'ratings',
  'reports',
  'cars',
]

export function User() {
  const { id } = useParams();
  const { data, loading, error, refetch } = useQuery<GetUserQuery>(GetUser, { variables: { id } });
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  const user = data?.getUser;

  const toast = useToast();
  const navigate = useNavigate();
  const { tab } = useParams();

  const [clear, { loading: isClearLoading, error: clearError }] = useMutation(ClearQueue);
  const [verify, { loading: isVerifyLoading, error: verifyError }] = useMutation<VerifyUserMutation>(VerifyUser);

  const [stopBeeping, setStopBeeping] = useState<boolean>(true);

  const cancelRefClear = React.useRef();

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

  const {
    isOpen: isPhotoOpen,
    onOpen: onPhotoOpen,
    onClose: onPhotoClose
  } = useDisclosure();

  async function doClear() {
    try {
      await clear({
        variables: { id, stopBeeping }
      });
      if (refetch) refetch();
      onClearClose();
      toast({
        title: "Queue Cleared",
        description: `${user?.name}'s queue has been cleared ${stopBeeping ? ' and they have stopped beeping.' : ''}`,
        status: "success",
      });
    }
    catch (e) {
      onClearClose();
    }
  }

  const onVerify = () => {
    verify({
      variables: { id, data: { isEmailVerified: true, isStudent: true } },
    }).then(() => {
      toast({ title: "User verified", status: "success" });
    });
  };

  if (error) {
    return <Error error={error} />;
  }

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <>
      <Box>
        {clearError && <Error error={clearError} />}
        {verifyError && <Error error={verifyError} />}
        <Flex alignItems="center" flexWrap="wrap">
          <Flex alignItems="center">
            <Box mr={4}>
              <Avatar
                src={user.photo || ''}
                size={isDesktop ? "2xl" : "xl"}
                onClick={user.photo ? onPhotoOpen : undefined}
                cursor={user.photo ? "pointer" : undefined}
              >
                {user.isBeeping && <AvatarBadge boxSize="1.0em" bg="green.500" />}
              </Avatar>
            </Box>
            <Box>
              <Heading size="md">{user.name}</Heading>
              <Text>@{user.username}</Text>
              <Text fontSize="xs" textOverflow="ellipsis">{user.id}</Text>
              {user.created && (<Text fontSize="xs">Joined {dayjs().to(user.created)}</Text>)}
              <Stack direction="row" mt="2" mb="2">
                {user.role === UserRole.ADMIN && <Badge variant="solid" colorScheme="red">admin</Badge>}
                {user.isStudent && <Badge variant="solid" colorScheme="blue">student</Badge>}
              </Stack>
            </Box>
          </Flex>
          <Spacer />
          <Box py={4}>
            <NavLink to={`/admin/users/${user.id}/edit`}>
              <Button m='1'>
                Edit
              </Button>
            </NavLink>
            {!user.isEmailVerified &&
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
            <Button
              m={1}
              colorScheme="purple"
              onClick={onSendNotificationOpen}
              isDisabled={!user?.pushToken}
            >
              Send Notification
            </Button>
            <Button
              m='1'
              colorScheme='blue'
              onClick={onClearOpen}
            >
              Clear Queue
            </Button>
            <Button
              m={1}
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              onClick={onDeleteOpen}
            >
              Delete
            </Button>
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
          <Box overflowX="auto">
            <TabList>
              {tabs.map((tab: string, idx) => <Tab key={idx} style={{ textTransform: 'capitalize' }}>{tab}</Tab>)}
            </TabList>
          </Box>
          <TabPanels>
            <TabPanel>
              <Details user={user} />
            </TabPanel>
            <TabPanel>
              <LocationView user={user} />
            </TabPanel>
            <TabPanel>
              <QueueTable user={user} />
            </TabPanel>
            <TabPanel>
              <BeepsTable userId={user.id} />
            </TabPanel>
            <TabPanel>
              <RatingsTable userId={user.id} />
            </TabPanel>
            <TabPanel>
              <ReportsTable userId={user.id} />
            </TabPanel>
            <TabPanel>
              <CarsTable userId={user.id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <DeleteUserDialog
        userId={user.id}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
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
      <PhotoDialog
        src={user.photo}
        isOpen={isPhotoOpen}
        onClose={onPhotoClose}
      />
    </>
  );
}
