import React from 'react';
import { UserMenu } from './UserMenu';
import { AdminMenu } from './AdminMenu';
import { Link } from '@tanstack/react-router';
import { trpc } from '../utils/trpc';
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
  const { data: user } = trpc.user.me.useQuery(undefined, { enabled: false, retry: false });

  return (
    <Flex as="nav" h={16} alignItems='center' justifyContent='space-between' px={4} mb={4} borderBottom="1px" bg={useColorModeValue("rgba(255, 255, 255, 0.8)", "rgb(20, 24, 28, 0.85)")} borderBottomColor={useColorModeValue("gray.100", "#32373e")} position="fixed" w="full" zIndex={999} css={{ backdropFilter: 'blur(4px)' }}>
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
          size={{ base: 'xl', md: "lg" }}
        >
          🚕
        </Heading>
      </HStack>
      <HStack spacing={[2, 3]}>
        <Button onClick={toggleColorMode}>{colorMode === 'light' ? "🌙" : "☀️"}</Button>
        <>
          {user?.role === "admin" && <AdminMenu />}
          {user && <UserMenu />}
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
