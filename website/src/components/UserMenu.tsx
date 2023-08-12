import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GetUserData } from "../App";
import { GetUserDataQuery, LogoutMutation } from "../generated/graphql";
import { client } from "../utils/Apollo";
import { LiaKeySolid, LiaSignOutAltSolid, LiaUserEditSolid } from 'react-icons/lia';
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

const Logout = gql`
  mutation Logout {
    logout (isApp: false)
  }
`;

export function UserMenu() {
  const { data } = useQuery<GetUserDataQuery>(GetUserData);
  const [logout] = useMutation<LogoutMutation>(Logout);
  const navigate = useNavigate();

  const user = data?.getUser;

  const handleLogout = async () => {
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
