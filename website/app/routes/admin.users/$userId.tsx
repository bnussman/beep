import React, { useState } from "react";
import { useTRPC } from "../../../src/utils/trpc";
import { Loading } from "../../../src/components/Loading";
import { ClearQueueDialog } from "../../../src/components/ClearQueueDialog";
import { SendNotificationDialog } from "../../../src/components/SendNotificationDialog";
import { PhotoDialog } from "../../../src/components/PhotoDialog";
import { DeleteUserDialog } from "../../../src/routes/admin/users/DeleteUserDialog";
import { Link, Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { useNotifications } from "@toolpad/core";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
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

export const Route = createFileRoute("/admin/users/$userId")({
  component: User,
});

export function User() {
  const trpc = useTRPC();
  const { userId } = Route.useParams();

  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery(trpc.user.user.queryOptions(userId));

  useSubscription(
    trpc.user.updates.subscriptionOptions(userId, {
      onData(user) {
        queryClient.setQueryData(trpc.user.user.queryKey(userId), user);
      },
    }),
  );

  const { mutate: syncPayments, isPending: isSyncingPayments } = useMutation(
    trpc.user.syncPayments.mutationOptions({
      onSuccess(activePayments) {
        notifications.show(
          `Payments synced. The user has ${activePayments.length} active payments.`,
          {
            severity: "success",
          },
        );
      },
      onError(error) {
        notifications.show(error.message, { severity: "error" });
      },
    }),
  );

  const { mutate: updateUser, isPending: isVerifyLoading } = useMutation(
    trpc.user.editAdmin.mutationOptions({
      onSuccess() {
        notifications.show("User verified", { severity: "success" });
      },
      onError(error) {
        notifications.show(error.message, { severity: "error" });
      },
    }),
  );

  const { mutate: sendTestEmail, isPending: isSendingTestEmail } = useMutation(
    trpc.user.sendTestEmail.mutationOptions({
      onSuccess() {
        notifications.show("Email sent", { severity: "success" });
      },
      onError(error) {
        notifications.show(error.message, { severity: "error" });
      },
    }),
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isClearOpen, setIsClearOpen] = useState(false);

  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);

  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const onVerify = () => {
    updateUser({
      userId,
      data: { isEmailVerified: true, isStudent: true },
    });
  };

  const onSyncPayments = () => {
    syncPayments(userId);
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
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={user.photo ?? ""}
            onClick={user.photo ? () => setIsPhotoOpen(true) : undefined}
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
                Joined {DateTime.fromISO(user.created).toRelative()}
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
            onClick={() => setIsSendNotificationOpen(true)}
            color="info"
          >
            Send Notification
          </Button>
          <Button
            variant="contained"
            onClick={onSyncPayments}
            loading={isSyncingPayments}
            color="secondary"
          >
            Sync Payments
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsClearOpen(true)}
            color="warning"
          >
            Clear Queue
          </Button>
          <Button
            variant="contained"
            onClick={() => sendTestEmail({ userId })}
            loading={isSendingTestEmail}
            color="warning"
          >
            Send Test Email
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => setIsDeleteOpen(true)}
          >
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
        onClose={() => setIsDeleteOpen(false)}
        isOpen={isDeleteOpen}
      />
      <ClearQueueDialog
        isOpen={isClearOpen}
        onClose={() => setIsClearOpen(false)}
        userId={user.id}
      />
      <SendNotificationDialog
        id={user.id}
        isOpen={isSendNotificationOpen}
        onClose={() => setIsSendNotificationOpen(false)}
      />
      <PhotoDialog
        src={user.photo}
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
      />
    </Stack>
  );
}
