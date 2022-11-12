import React from "react";
import { Link } from 'react-router-dom';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react"

export function AdminDropdown() {
  return (
    <Menu>
      <Button
        as={MenuButton}
        textColor="white"
        bgGradient='linear(to-r, #fb7ba2, #fce043)'
        boxShadow="0 0 15px 2px #fb7ba2"
        _hover={{
          bgGradient: 'linear(to-r, pink.200, yellow.200)',
          boxShadow: "0 0 15px 4px #fb7ba2"
        }}
        _active={{
          bgGradient: 'linear(to-r, pink.300, yellow.400)',
        }}
      >
        Admin
      </Button>
      <MenuList>
        <MenuItem as={Link} to="/admin">
          Dashboard
        </MenuItem>
        <MenuItem as={Link} to="/admin/users/beeps">
          Leaderboards
        </MenuItem>
        <MenuItem as={Link} to="/admin/users">
          Users
        </MenuItem>
        <MenuItem as={Link} to="/admin/beepers">
          Beepers
        </MenuItem>
        <MenuItem as={Link} to="/admin/beeps">
          Beeps
        </MenuItem>
        <MenuItem as={Link} to="/admin/reports">
          Reports
        </MenuItem>
        <MenuItem as={Link} to="/admin/ratings">
          Ratings
        </MenuItem>
        <MenuItem as={Link} to="/admin/cars">
          Cars
        </MenuItem>
        <MenuItem as={Link} to="/admin/beeps/active">
          Beeps in progress
        </MenuItem>
        <MenuItem as={Link} to="/admin/notifications">
          Notifications
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
