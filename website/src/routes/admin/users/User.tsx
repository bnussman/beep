import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Loading } from '../../../components/Loading';
import { ClearQueueDialog } from '../../../components/ClearQueueDialog';
import { SendNotificationDialog } from '../../../components/SendNotificationDialog';
import { UserRole } from '../../../types/User';
import { useMutation, useQuery } from '@apollo/client';
import { DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { Error } from '../../../components/Error';
import { PhotoDialog } from '../../../components/PhotoDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { Link, Outlet, createRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { usersRoute } from '.';
import { graphql } from '../../../graphql';
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
  useMediaQuery,
} from '@chakra-ui/react';

dayjs.extend(relativeTime);

export const GetUser = graphql(`
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
`);

const VerifyUser = graphql(`
  mutation VerifyUser($id: String!, $data: EditUserInput!) {
    editUser(id: $id, data: $data) {
      id
      isEmailVerified
      isStudent
    }
  }
`);

const ClearQueue = graphql(`
  mutation ClearQueue($id: String!, $stopBeeping: Boolean!) {
    clearQueue(id: $id, stopBeeping: $stopBeeping)
  }
`);

const SyncPayments = graphql(`
  mutation SyncPayments($id: String) {
    checkUserSubscriptions(id: $id) {
      id
      productId
      price
    }
  }
`);


const tabs = [
  'details',
  'location',
  'queue',
  'beeps',
  'ratings',
  'reports',
  'cars',
  'payments',
] as const;

export const userRoute = createRoute({
  component: User,
  path: "$userId",
  getParentRoute: () => usersRoute,
});

export function User() {
  const { userId } = userRoute.useParams();
  const { data, loading, error, refetch } = useQuery(GetUser, { variables: { id: userId } });
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  const user = data?.getUser;

  const toast = useToast();
  const navigate = useNavigate({ from: userRoute.id });
  const routerState = useRouterState();

  const [clear, { loading: isClearLoading, error: clearError }] = useMutation(ClearQueue);
  const [verify, { loading: isVerifyLoading, error: verifyError }] = useMutation(VerifyUser);
  const [syncPayments, { loading: isSyncingPayments }] = useMutation(SyncPayments);

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
        variables: { id: userId, stopBeeping }
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
      variables: { id: userId, data: { isEmailVerified: true, isStudent: true } },
    }).then(() => {
      toast({ title: "User verified", status: "success" });
    });
  };

  const onSyncPayments = () => {
    syncPayments({
      variables: { id: userId },
    }).then(() => {
      toast({ title: "Payments synced", status: "success" });
    }).catch((error) => {
      toast({ title: "Error", description: error.message, status: "error" });
    });
  };

  const path = routerState.location.pathname;

  const foundTabIndex = tabs.findIndex(tab => path.endsWith(tab));

  const currentTabIndex = foundTabIndex === -1 ? 0 : foundTabIndex;

  if (path.endsWith("/edit")) {
    return <Outlet />;
  }

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
            <Link to="/admin/users/$userId/edit" params={{ userId }}>
              <Button m='1'>
                Edit
              </Button>
            </Link>
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
              m={1}
              colorScheme="yellow"
              onClick={onSyncPayments}
              isLoading={isSyncingPayments}
            >
              Sync Payments
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
          index={currentTabIndex}
          onChange={(i) => navigate({ to: `/admin/users/$userId/${tabs[i]}`, params: { userId } })}
        >
          <Box overflowX="auto">
            <TabList>
              {tabs.map((tab: string, idx) => <Tab key={idx} style={{ textTransform: 'capitalize' }}>{tab}</Tab>)}
            </TabList>
          </Box>
        </Tabs>
        <Box mt={4}>
          <Outlet />
        </Box>
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
