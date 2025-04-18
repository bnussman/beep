import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { trpc } from "../../../utils/trpc";
import { Loading } from "../../../components/Loading";
import { ClearQueueDialog } from "../../../components/ClearQueueDialog";
import { SendNotificationDialog } from "../../../components/SendNotificationDialog";
import { PhotoDialog } from "../../../components/PhotoDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { Link, Outlet, createRoute, useLocation } from "@tanstack/react-router";
import { useToast, useDisclosure } from "@chakra-ui/react";
import { usersRoute } from "./routes";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

dayjs.extend(relativeTime);

const tabs = [
  "details",
  "location",
  "queue",
  "beeps",
  "ratings",
  "reports",
  "cars",
  "payments",
] as const;

export const userRoute = createRoute({
  component: User,
  path: "$userId",
  getParentRoute: () => usersRoute,
});

export function User() {
  const { userId } = userRoute.useParams();

  const utils = trpc.useUtils();
  const toast = useToast();

  const { data: user, isLoading, error } = trpc.user.user.useQuery(userId);

  trpc.user.updates.useSubscription(userId, {
    onData(user) {
      utils.user.user.setData(userId, user);
    },
  });

  const { mutateAsync: syncPayments, isPending: isSyncingPayments } =
    trpc.user.syncPayments.useMutation();

  const { mutateAsync: updateUser, isPending: isVerifyLoading } =
    trpc.user.editAdmin.useMutation();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isClearOpen,
    onOpen: onClearOpen,
    onClose: onClearClose,
  } = useDisclosure();

  const {
    isOpen: isSendNotificationOpen,
    onOpen: onSendNotificationOpen,
    onClose: onSendNotificationClose,
  } = useDisclosure();

  const {
    isOpen: isPhotoOpen,
    onOpen: onPhotoOpen,
    onClose: onPhotoClose,
  } = useDisclosure();

  const onVerify = () => {
    updateUser({
      userId,
      data: { isEmailVerified: true, isStudent: true },
    })
      .then(() => {
        toast({ title: "User verified", status: "success" });
      })
      .catch((error) => {
        toast({ title: "Error", description: error.message, status: "error" });
      });
  };

  const onSyncPayments = () => {
    syncPayments(userId)
      .then((activePayments) => {
        toast({
          title: "Payments synced",
          description: `The user has ${activePayments.length} active payments.`,
          status: "success",
        });
      })
      .catch((error) => {
        toast({ title: "Error", description: error.message, status: "error" });
      });
  };

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const foundTabIndex = tabs.findIndex((tab) => pathname.endsWith(tab));

  const currentTabIndex = foundTabIndex === -1 ? 0 : foundTabIndex;

  if (pathname.endsWith("/edit")) {
    return <Outlet />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={user.photo ?? ""}
            onClick={user.photo ? onPhotoOpen : undefined}
            sx={{
              ...(user.photo ? { cursor: "pointer" } : {}),
              width: 120,
              height: 120,
            }}
          />
          <Stack>
            <Typography fontWeight="bold" variant="h4">
              {user.first} {user.last}
            </Typography>
            <Typography>{user.username}</Typography>
            <Typography fontSize="12px">{user.id}</Typography>
            {user.created && (
              <Typography fontSize="12px">
                Joined {dayjs().to(user.created)}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack
          direction="row"
          gap={1}
          flexWrap="wrap"
          justifyContent="flex-end"
        >
          <Link to="/admin/users/$userId/edit" params={{ userId }}>
            <Button variant="contained">Edit</Button>
          </Link>
          {!user.isEmailVerified && (
            <Button
              color="success"
              variant="contained"
              onClick={onVerify}
              loading={isVerifyLoading}
            >
              Verify
            </Button>
          )}
          <Button
            variant="contained"
            color="info"
            onClick={onSendNotificationOpen}
            disabled={!user?.pushToken}
          >
            Send Notification
          </Button>
          <Button
            color="info"
            variant="contained"
            onClick={onSyncPayments}
            loading={isSyncingPayments}
          >
            Sync Payments
          </Button>
          <Button variant="contained" color="warning" onClick={onClearOpen}>
            Clear Queue
          </Button>
          <Button color="error" variant="contained" onClick={onDeleteOpen}>
            Delete
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTabIndex}>
          {tabs.map((tab, idx) => (
            <Tab
              label={tab}
              key={idx}
              LinkComponent={Link}
              href={`/admin/users/${user.id}/${tab}`}
            />
          ))}
        </Tabs>
      </Box>
      <Box>
        <Outlet />
      </Box>
      <DeleteUserDialog
        userId={user.id}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
      />
      <ClearQueueDialog
        isOpen={isClearOpen}
        onClose={onClearClose}
        userId={user.id}
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
    </Stack>
  );
}
