import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { trpc } from '../../../utils/trpc';
import { TRPCClientError } from '@trpc/client';
import { Loading } from '../../../components/Loading';
import { ClearQueueDialog } from '../../../components/ClearQueueDialog';
import { SendNotificationDialog } from '../../../components/SendNotificationDialog';
import { DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { Error } from '../../../components/Error';
import { PhotoDialog } from '../../../components/PhotoDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { Link, Outlet, createRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { usersRoute } from '.';
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
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = trpc.user.user.useQuery(userId);

  const utils = trpc.useUtils();

  trpc.user.updates.useSubscription(userId, {
    onData(user) {
      utils.user.user.setData(userId, user);
    }
  });

  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  const toast = useToast();
  const navigate = useNavigate({ from: userRoute.id });
  const routerState = useRouterState();

  const {
    mutateAsync: clearQueue,
    isPending: isClearLoading,
    error: clearError
  } = trpc.beep.clearQueue.useMutation();

  const {
    mutateAsync: syncPayments,
    isPending: isSyncingPayments
  } = trpc.user.syncPayments.useMutation();

  const {
    mutateAsync: updateUser,
    isPending: isVerifyLoading,
    error: verifyError
  } = trpc.user.editAdmin.useMutation();

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
      await clearQueue({
        userId, stopBeeping
      });
      if (refetch) refetch();
      onClearClose();
      toast({
        title: "Queue Cleared",
        description: `${user?.first}'s queue has been cleared ${stopBeeping ? ' and they have stopped beeping.' : ''}`,
        status: "success",
      });
    }
    catch (e) {
      onClearClose();
      toast({
        title: "Unable to clear user's queue",
        description: (e as TRPCClientError<any>).message,
        status: "error",
      });
    }
  }

  const onVerify = () => {
    updateUser({
      userId,
      data: { isEmailVerified: true, isStudent: true }
    }).then(() => {
      toast({ title: "User verified", status: "success" });
    });
  };

  const onSyncPayments = () => {
    syncPayments({ userId }).then((activePayments) => {
      toast({ title: "Payments synced", description: `The user has ${activePayments.length} active payments.`, status: "success" });
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
    return <Error>{error.message}</Error>;
  }

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <>
      <Box>
        {clearError && <Error>{clearError.message}</Error>}
        {verifyError && <Error>{verifyError.message}</Error>}
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
              <Heading size="md">{user.first} {user.last}</Heading>
              <Text>@{user.username}</Text>
              <Text fontSize="xs" textOverflow="ellipsis">{user.id}</Text>
              {user.created && (<Text fontSize="xs">Joined {dayjs().to(user.created)}</Text>)}
              <Stack direction="row" mt="2" mb="2">
                {user.role === "user" && <Badge variant="solid" colorScheme="red">admin</Badge>}
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
