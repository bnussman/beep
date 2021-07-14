import { useContext } from 'react';
import { Link } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {UserDropdown} from './UserDropdown';
import {AdminDropdown} from './AdminDropdown';
import {UserContext} from '../UserContext';
import {UserRole} from '../types/User';
import { ThemeToggle } from './ThemeToggle';
import {
    Box,
    Flex,
    HStack,
    IconButton,
    useDisclosure,
    Stack,
    Button,
    Image
} from '@chakra-ui/react';
import React from 'react';
import Logo from '../assets/favicon.png';

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useContext(UserContext);

  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: !isOpen ? 'none' : 'inherit' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Flex alignItems={'center'}>
                <Image h={8} src={Logo} />
                <Box ml={4} as={Link} to='/'>Beep App</Box>
              </Flex>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              <Link to='/faq'>FAQ</Link>
              <Link to='/about'>About</Link>
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={4}
              alignItems='center'
            >
              <>
                {(user && user.role === UserRole.ADMIN) &&
                  <AdminDropdown />
                }
                {user &&
                  <UserDropdown />
                }
                {!user &&
                  <>
                    <Button
                      as={Link}
                      fontSize={'sm'}
                      fontWeight={400}
                      variant={'link'}
                      to={'/login'}>
                      Sign In
                    </Button>
                    <Button
                      as={Link}
                      fontSize={'sm'}
                      fontWeight={600}
                      color={'white'}
                      bg={'yellow.400'}
                      to='/signup'
                      _hover={{
                        bg: 'yellow.300',
                      }}>
                      Sign Up
                    </Button>
                  </>
                }
                <ThemeToggle />
              </>
            </Stack>
          </Flex>
        </Flex>
      </Box>
      {isOpen ? (
        <Box pb={4}>
          <Stack as={'nav'} spacing={4}>
            <Link to='/faq'>FAQ</Link>
            <Link to='/about'>About</Link>
          </Stack>
        </Box>
      ) : null}
    </>
  );
}
