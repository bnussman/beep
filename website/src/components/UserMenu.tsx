import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { queryClient, useTRPC } from "../utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Dropdown, Label } from "@heroui/react";

export function UserMenu() {
  const trpc = useTRPC();

  const { data: user } = useQuery(
    trpc.user.me.queryOptions(undefined, {
      enabled: false,
      retry: false,
    }),
  );
  const { mutateAsync: logout } = useMutation(
    trpc.auth.logout.mutationOptions(),
  );
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout({});

      localStorage.removeItem("user");

      queryClient.resetQueries();

      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar size="sm">
          <Avatar.Image alt={user?.first} src={user?.photo ?? undefined} />
          <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image
              alt={user?.first}
              src={user?.photo ?? undefined}
              />
              <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">{user?.first} {user?.last}</p>
              <p className="text-xs leading-none text-muted">{user?.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item id="dashboard" render={(props) => <Link to="/profile/edit" {...props} />}>
            <Label>Edit Account</Label>
          </Dropdown.Item>
          <Dropdown.Item id="profile" render={(props) => <Link to="/password/change" {...props} />}>
            <Label>Change Password</Label>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Logout" variant="danger" onClick={handleLogout}>
            <Label>Log Out</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
