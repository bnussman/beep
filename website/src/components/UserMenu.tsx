import React from "react";
import { Avatar, Button, Dropdown, Label, Separator } from "@heroui/react";
import { createLink, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";
import { queryClient } from "../utils/tanstack-query";

const RouterMenuItem = createLink(Dropdown.Item);

export function UserMenu() {
  const navigate = useNavigate();

  const { data: user } = useQuery(
    orpc.user.me.queryOptions({
      enabled: false,
      retry: false,
    }),
  );

  const { mutate: logout } = useMutation(
    orpc.auth.logout.mutationOptions({
      onSuccess() {
        localStorage.removeItem("user");

        queryClient.resetQueries();

        navigate({ to: "/" });
      }
    }),
  );

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar>
          <Avatar.Image alt={`${user?.first} ${user?.last}`} src={user?.photo ?? undefined} />
          <Avatar.Fallback>
            {user?.first.at(0)?.toUpperCase()}{user?.last?.at(0)?.toUpperCase()}
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
         <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar>
              <Avatar.Image alt={`${user?.first} ${user?.last}`} src={user?.photo ?? undefined} />
              <Avatar.Fallback>
                {user?.first.at(0)?.toUpperCase()}{user?.last?.at(0)?.toUpperCase()}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">{user?.first} {user?.last}</p>
              <p className="text-xs leading-none text-muted">{user?.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <RouterMenuItem
            id="edit-account"
            textValue="Edit Account"
            to="/profile/edit"
          >
            <Label>Edit Account</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="change-password"
            textValue="Change Password"
            to="/password/change"
          >
            <Label>Change Password</Label>
          </RouterMenuItem>
          <Separator />
          <Dropdown.Item
            id="sign-out"
            textValue="Sign out"
            variant="danger"
            onAction={() => logout({})}
          >
            <Label>Sign out</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
