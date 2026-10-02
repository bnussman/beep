import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { useSubscription } from "../../../utils/subscriptions";
import { Loading } from "../../../components/Loading";
import { ClearQueueDialog } from "../../../components/ClearQueueDialog";
import { SendNotificationDialog } from "../../../components/SendNotificationDialog";
import { PhotoDialog } from "../../../components/PhotoDialog";
import { DeleteUserDialog } from "../../../components/DeleteUserDialog";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  useLocation,
  useNavigate,
  createFileRoute,
} from "@tanstack/react-router";
import { Alert, Avatar, Button, Tabs, toast, Typography } from "@heroui/react";
import { LinkButton } from "../../../components/LinkButton";

export const Route = createFileRoute("/admin/users/$userId")({
  component: User,
  ssr: false,
});

function User() {
  const { userId } = Route.useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.id });

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
        toast.success(
          `Payments synced. The user has ${activePayments.length} active payments.`,
          { timeout: 5_000 },
        );
      },
      onError(error) {
        toast.danger(error.message, { timeout: 5_000 });
      },
    }),
  );

  const { mutate: updateUser, isPending: isVerifyLoading } = useMutation(
    orpc.user.editAdmin.mutationOptions({
      onSuccess() {
        toast.success("User verified", { timeout: 5_000 });
      },
      onError(error) {
        toast.danger(error.message, { timeout: 5_000 });
      },
    }),
  );

  const { mutate: sendTestEmail, isPending: isSendingTestEmail } = useMutation(
    orpc.user.sendTestEmail.mutationOptions({
      onSuccess() {
        toast.success("Email sent", { timeout: 5_000 });
      },
      onError(error) {
        toast.danger(error.message, { timeout: 5_000 });
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
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Content>
      </Alert>
    );
  }

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            aria-label={user.photo ? `View ${user.first} ${user.last}'s photo` : undefined}
            disabled={!user.photo}
            onClick={() => setIsPhotoOpen(true)}
            className="rounded-full disabled:cursor-default"
          >
            <Avatar className="size-30 rounded-full">
              <Avatar.Image
                alt={`${user.first} ${user.last}`}
                src={user.photo ?? undefined}
              />
              <Avatar.Fallback>
                {user.first.at(0)?.toUpperCase()}{user.last.at(0)?.toUpperCase()}
              </Avatar.Fallback>
            </Avatar>
          </button>
          <div className="flex flex-col gap-2">
            <Typography type="h1">
              {user.first} {user.last}
            </Typography>
            <Typography type="body" className="leading-none">{user.username}</Typography>
            <Typography type="body" className="text-xs leading-none">{user.id}</Typography>
            {user.created && (
              <Typography type="body" className="text-xs leading-none">
                Joined {DateTime.fromJSDate(user.created).toRelative()}
              </Typography>
            )}
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-end gap-2">
          <LinkButton
            to="/admin/users/$userId/edit"
            params={{ userId: user.id }}
            size="sm"
            variant="tertiary"
          >
            Edit
          </LinkButton>
          {!user.isEmailVerified && (
            <Button
              size="sm"
              onPress={onVerify}
              isPending={isVerifyLoading}
            >
              Verify
            </Button>
          )}
          <Button
            size="sm"
            onPress={() => setIsSendNotificationOpen(true)}
            variant="tertiary"
          >
            Send Notification
          </Button>
          <Button
            size="sm"
            onPress={onSyncPayments}
            isPending={isSyncingPayments}
            variant="tertiary"
          >
            Sync Payments
          </Button>
          <Button
            size="sm"
            onPress={() => setIsClearOpen(true)}
            variant="tertiary"
          >
            Clear Queue
          </Button>
          {user.role === "admin" && (
            <Button
              size="sm"
              onPress={() => sendTestEmail({ userId })}
              isPending={isSendingTestEmail}
              variant="tertiary"
            >
              Send Test Email
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onPress={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      <Tabs
        selectedKey={tabs[currentTabIndex]}
        onSelectionChange={(key) => {
          navigate({ to: `/admin/users/${user.id}/${String(key)}` });
        }}
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="User sections">
            {tabs.map((tab) => (
              <Tabs.Tab id={tab} key={tab} className="capitalize">
                {tab}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
      <div>
        <Outlet />
      </div>
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
    </div>
  );
}
