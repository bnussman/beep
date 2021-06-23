import { gql, useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { GetUserData } from "../App";
import { LogoutMutation } from "../generated/graphql";
import { UserContext } from "../UserContext";
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
    const user = useContext(UserContext);
    const [logout] = useMutation<LogoutMutation>(Logout);
    const history = useHistory();

    async function handleLogout() {
        try {
            client.writeQuery({
                query: GetUserData,
                data: {
                    getUser: null
                }
            });
            history.push("/");

            await logout();
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
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}>
                <Avatar
                    size={'sm'}
                    src={user.photoUrl}
                >
                    {user.isBeeping && <AvatarBadge boxSize="1.0rem" bg="green.500" />}
                </Avatar>
            </MenuButton>
            <MenuList>
                <MenuItem isDisabled>
                    @{user.username}
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
