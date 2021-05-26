import { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {UserDropdown} from './UserDropdown';
import {AdminDropdown} from './AdminDropdown';
import {gql, useMutation} from '@apollo/client';
import {ResendEmailMutation} from '../generated/graphql';
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
    AlertIcon,
    Alert,
    Button,
    Image
} from '@chakra-ui/react';

const Resend = gql`
    mutation ResendEmail {
        resendEmailVarification
    }
`;

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resend, { error }] = useMutation<ResendEmailMutation>(Resend);
  const user = useContext(UserContext);
  const [resendStatus, setResendStatus] = useState<string>();
  const [refreshStatus, setRefreshStatus] = useState<string>();

  async function resendVarificationEmail() {
    try {
      const result = await resend();
      if (result) {
        setResendStatus("Successfully resent email");
      }
      else {
        setResendStatus(error.message);
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

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
                <Image h={8} src="/favicon.png" />
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
            {(user && user.role === UserRole.ADMIN) &&
              <AdminDropdown />
            }
            {user &&
              <UserDropdown />
            }
            {!user &&
              <Stack
                flex={{ base: 1, md: 0 }}
                justify={'flex-end'}
                direction={'row'}
                spacing={6}>
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
              </Stack>
            }
            <ThemeToggle />
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4}>
            <Stack as={'nav'} spacing={4}>
              <Link to='/faq'>FAQ</Link>
              <Link to='/about'>About</Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
      {(user && !user.isEmailVerified) &&
        <Box>
          <Alert status="error">
            <AlertIcon />
                    You need to verify your email!
                    <Button onClick={resendVarificationEmail}>
              Resend my verification email
                    </Button>
          </Alert>
          {refreshStatus &&
            <Alert status="info" onClick={() => { setRefreshStatus(null) }}>
              <AlertIcon />
              {refreshStatus}
            </Alert>
          }
          {resendStatus &&
            <Alert status="info" onClick={() => { setResendStatus(null) }}>
              <AlertIcon />
              {resendStatus}
            </Alert>
          }
        </Box>
      }
    </>
  );
}
