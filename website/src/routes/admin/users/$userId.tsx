import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { useSubscription } from "../../../utils/subscriptions";
import { Loading } from "../../../components/Loading";
import { ClearQueueDialog } from "../../../components/ClearQueueDialog";
import { SendNotificationDialog } from "../../../components/SendNotificationDialog";
import { PhotoDialog } from "../../../components/PhotoDialog";
import { DeleteUserDialog } from "../../../components/DeleteUserDialog";
import { useNotifications } from "@toolpad/core";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  useLocation,
  createFileRoute,
} from "@tanstack/react-router";
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

export const Route = createFileRoute("/admin/users/$userId")({
  component: User,
});

function User() {
  const { userId } = Route.useParams();

  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const {
    data: user,
    isPending,
    error,
  } = useQuery(orpc.user.user.queryOptions({ input: userId }));

  useSubscription({
    ...orpc.user.updates.liveOptions({
      input: userId,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(orpc.user.user.queryKey({ input: userId }), data);
    },
  });

  const { mutate: syncPayments, isPending: isSyncingPayments } = useMutation(
    orpc.user.syncPayments.mutationOptions({
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
    orpc.user.editAdmin.mutationOptions({
      onSuccess() {
        notifications.show("User verified", { severity: "success" });
      },
      onError(error) {
        notifications.show(error.message, { severity: "error" });
      },
    }),
  );

  const { mutate: sendTestEmail, isPending: isSendingTestEmail } = useMutation(
    orpc.user.sendTestEmail.mutationOptions({
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
    syncPayments({ userId });
  };

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const tabs = [
    "details",
    "location",
    "ride",
    "queue",
    "beeps",
    "ratings",
    "reports",
    "cars",
    "payments",
  ] as const;

  const foundTabIndex = tabs.findIndex((tab) => pathname.endsWith(tab));

  const currentTabIndex = foundTabIndex === -1 ? 0 : foundTabIndex;

  if (pathname.includes("/edit")) {
    return <Outlet />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (isPending) {
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
                Joined {DateTime.fromJSDate(user.created).toRelative()}
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
          <Button
            LinkComponent={Link}
            href={`/admin/users/${user.id}/edit`}
            variant="contained"
            size="small"
          >
            Edit
          </Button>
          {!user.isEmailVerified && (
            <Button
              variant="contained"
              size="small"
              onClick={onVerify}
              loading={isVerifyLoading}
            >
              Verify
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsSendNotificationOpen(true)}
          >
            Send Notification
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onSyncPayments}
            loading={isSyncingPayments}
          >
            Sync Payments
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsClearOpen(true)}
          >
            Clear Queue
          </Button>
          {user.role === "admin" && (
            <Button
              variant="contained"
              size="small"
              onClick={() => sendTestEmail({ userId })}
              loading={isSendingTestEmail}
            >
              Send Test Email
            </Button>
          )}
          <Button
            color="error"
            size="small"
            variant="contained"
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTabIndex}>
          {tabs.map((tab) => (
            <Tab
              label={tab}
              key={tab}
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
