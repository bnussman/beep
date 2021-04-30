import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react"
import { Link } from 'react-router-dom';

export function AdminDropdown() {
    return (
        <Menu>
            <Button
                as={MenuButton}
                variant={'solid'}
                colorScheme="brand"
                color="white"
                size={'sm'}
                mr={4}
                Action
            >
                Admin
            </Button>
            <MenuList>
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
            </MenuList>
        </Menu>
    );
}
