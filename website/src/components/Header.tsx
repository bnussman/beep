import React from 'react';
import { Link } from "react-router-dom";
import { UserDropdown } from './UserDropdown';
import { AdminDropdown } from './AdminDropdown';
import { UserRole } from '../types/User';
import { useQuery } from '@apollo/client';
import { GetUserDataQuery } from '../generated/graphql';
import { GetUserData } from '../App';
import {
  Flex,
  HStack,
  Button,
  useColorMode,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data } = useQuery<GetUserDataQuery>(GetUserData);

  const user = data?.getUser;

  return (
    <Flex h={16} alignItems='center' justifyContent='space-between' px={4} mb={4} bg={useColorModeValue("white", "rgb(20, 24, 28)")} borderBottom="1px" borderBottomColor={useColorModeValue("gray.100", "#32373e")}>
      <HStack spacing={4} alignItems='center'>
        <Heading
          as={Link}
          to="/"
          size="md"
          color="gray.800"
          _dark={{ color: 'white' }}
          display={{ base: 'none', md: "unset" }}
        >
          Ride Beep App
        </Heading>
        <Heading
          as={Link}
          to="/"
          size={{ base: 'xl', md: "md" }}
        >
          🚕
        </Heading>
      </HStack>
      <HStack spacing={[2, 4]}>
        <Button variant="outline" onClick={toggleColorMode}>{colorMode === 'light' ? "🌙" : "☀️"}</Button>
        {/* <HStack spacing={[2, 4]} mr={[0, 4]}>
          <Box>☀️</Box>
          <Switch
            isChecked={colorMode === "dark"}
            onChange={toggleColorMode}
            colorScheme="black"
            size="lg"
            ml={2}
          />
          <Box>🌑</Box>
        </HStack> */}
        <>
          {(user && user.role === UserRole.ADMIN) && <AdminDropdown />}
          {user && <UserDropdown />}
          {!user &&
            <>
              <Button
                as={Link}
                to='/login'
              >
                Login
              </Button>
              <Button
                as={Link}
                to='/signup'
                textColor="white"
                bgGradient='linear(to-r, #fb7ba2, #fce043)'
                boxShadow="0 0 15px 2px #fb7ba2"
                _hover={{
                  bgGradient: 'linear(to-r, pink.200, yellow.200)',
                }}
                _active={{
                  bgGradient: 'linear(to-r, pink.300, yellow.400)',
                }}
              >
                Sign Up
              </Button>
            </>
          }
        </>
      </HStack>
    </Flex>
  );
}
