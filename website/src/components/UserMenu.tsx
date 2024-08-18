import React from "react";
import { client } from "../utils/apollo";
import { LiaKeySolid, LiaSignOutAltSolid, LiaUserEditSolid } from 'react-icons/lia';
import { Link, useNavigate } from "@tanstack/react-router";
import { queryClient, trpc } from "../utils/trpc";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  AvatarBadge,
  MenuDivider,
  Icon,
} from "@chakra-ui/react"

export function UserMenu() {
  const { data: user } = trpc.user.me.useQuery(undefined, { enabled: false, retry: false });
  const { mutateAsync: logout } = trpc.auth.logout.useMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout({});

      localStorage.removeItem('user');

      client.resetStore();
      queryClient.resetQueries();

      navigate({ to: "/" });
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="outline"
        leftIcon={
          <Avatar
            size='xs'
            src={user?.photo || ''}
          >
            {user?.isBeeping && <AvatarBadge boxSize="0.75rem" bg="green.500" />}
          </Avatar>
        }
      >
        {user?.username}
      </MenuButton>
      <MenuList>
        <MenuItem icon={<Icon fontSize="2xl" as={LiaUserEditSolid} />} as={Link} to="/profile/edit">
          Edit Account
        </MenuItem>
        <MenuItem icon={<Icon fontSize="2xl" as={LiaKeySolid} />} as={Link} to="/password/change">
          Change Password
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={handleLogout}
          icon={<Icon fontSize="2xl" as={LiaSignOutAltSolid} />}
        >
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
