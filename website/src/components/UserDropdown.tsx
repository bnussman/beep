import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GetUserData } from "../App";
import { GetUserDataQuery, LogoutMutation } from "../generated/graphql";
import { client } from "../utils/Apollo";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  AvatarBadge,
  MenuDivider,
} from "@chakra-ui/react"

const Logout = gql`
  mutation Logout {
    logout (isApp: false)
  }
`;

export function UserDropdown() {
  const { data } = useQuery<GetUserDataQuery>(GetUserData);
  const [logout] = useMutation<LogoutMutation>(Logout);
  const navigate = useNavigate();

  const user = data?.getUser;

  async function handleLogout() {
    try {
      await logout();

      client.writeQuery({
        query: GetUserData,
        data: {
          getUser: null
        }
      });

      navigate("/");

      localStorage.removeItem('user');

    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded='full'
        variant='link'
        cursor='pointer'
      >
        <Avatar
          size='sm'
          src={user?.photo || ''}
        >
          {user?.isBeeping && <AvatarBadge boxSize="1.0rem" bg="green.500" />}
        </Avatar>
      </MenuButton>
      <MenuList>
        <MenuItem isDisabled>
          @{user?.username}
        </MenuItem>
        <MenuItem as={Link} to={`/profile/edit`}>
          Edit Account
        </MenuItem>
        <MenuItem as={Link} to="/password/change">
          Change Password
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => handleLogout()}>
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
