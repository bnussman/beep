import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { NavLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { Nav, NavItem } from './Nav';
import { UserRole } from '../types/User';
import {gql, useMutation} from '@apollo/client';
import {LogoutMutation, ResendEmailMutation} from '../generated/graphql';
import {ThemeToggle} from './ThemeToggle';
import {UserDropdown} from './UserDropdown';
import {AdminDropdown} from './AdminDropdown';

interface props {
    noErrors?: boolean;
}


const Resend = gql`
    mutation ResendEmail {
        resendEmailVarification
    }
`;

function BeepAppBar(props: props) {
    const [resend, { error }] = useMutation<ResendEmailMutation>(Resend);
    const { user, setUser } = useContext(UserContext);
    const [toggleNav, setToggle] = useState(false);
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
        catch(error) {
            console.error('Error:', error);
        }
    }
    return (
        <>
            <nav className="flex flex-wrap items-center justify-between p-6 dark:bg-black dark:text-white">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 mr-6 text-black dark:text-white">
                    <img
                        alt=""
                        src="/favicon.png"
                        width="30"
                        height="30"
                        className="align-top d-inline-block"
                    />
                    <NavLink to="/" className="pl-2 text-xl font-semibold tracking-tight">Beep App</NavLink>
                </div>

                {/* Menu button */}
                <div className="block lg:hidden">
                    <button onClick={() => setToggle(!toggleNav)} className="flex items-center px-3 py-2 text-black border rounded border-black-400 dark:border-white dark:hover:border-white dark:text-white focus:outline-none">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                    </button>
                </div>

                {/* Nav items */}
                <div className={!toggleNav ? "hidden w-full lg:items-center lg:w-auto lg:block items-end" : "w-full lg:items-center lg:w-auto lg:block"}>
                    <Nav direction={toggleNav ? 'col' : 'row'} className={toggleNav ? 'pl-0 pt-4' : ''}>
                        <NavItem to="/faq">FAQ</NavItem>
                        <NavItem to="/about">About Us</NavItem>
                        {(user && user.user.role === UserRole.ADMIN) &&
                            <AdminDropdown/>
                        }

                        {!user &&
                            <NavItem to="/login">Login</NavItem>
                        }

                        {user &&
                            <UserDropdown/>
                        }
                        <NavItem>
                            <ThemeToggle/>
                        </NavItem>
                    </Nav>
                </div>
            </nav>

            {(user && !user.user.isEmailVerified && !props.noErrors) &&

                <div className="px-4 mx-auto mb-4 lg:container" >
                    <div role="alert">
                        <div className="px-4 py-2 font-bold text-white bg-red-500 rounded-t">
                            Email Varification
                        </div>
                        <div className="px-4 py-3 text-red-700 bg-red-100 border border-t-0 border-red-400 rounded-b">
                            <p>You need to verify your email</p>
                            <p className="mt-2 text-sm underline cursor-pointer" onClick={resendVarificationEmail}>Resend my varification email</p>
                        </div>
                    </div>
                    {refreshStatus &&
                        <div role="alert" className="mt-4" onClick={() => { setRefreshStatus(null) }}>
                            <div className="px-4 py-2 font-bold text-white bg-blue-500 rounded-t">
                                Refresh Message
                            </div>
                            <div className="px-4 py-3 text-blue-700 bg-blue-100 border border-t-0 border-blue-400 rounded-b">
                                <p>{refreshStatus}</p>
                                <p className="text-xs">Click to dismiss</p>
                            </div>
                        </div>
                    }
                    {resendStatus &&
                        <div role="alert" className="mt-4" onClick={() => { setResendStatus(null) }}>
                            <div className="px-4 py-2 font-bold text-white bg-blue-500 rounded-t">
                                Resend Email Message
                            </div>
                            <div className="px-4 py-3 text-blue-700 bg-blue-100 border border-t-0 border-blue-400 rounded-b">
                                <p>{resendStatus}</p>
                                <p className="text-xs">Click to dismiss</p>
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    );
}

export default BeepAppBar;
