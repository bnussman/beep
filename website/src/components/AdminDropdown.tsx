import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import { Link } from 'react-router-dom';

export function AdminDropdown() {
    return (
        <Menu>
            <MenuButton
                variant={'solid'}
                colorScheme={'teal'}
                size={'sm'}
                mr={4}
                Action
            >
                Admin
            </MenuButton>
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
