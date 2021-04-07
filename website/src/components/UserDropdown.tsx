import {gql, useMutation} from "@apollo/client";
import { Menu, Transition } from "@headlessui/react";
import {useContext} from "react";
import {Link, useHistory} from "react-router-dom";
import {GetUserData} from "../App";
import {LogoutMutation} from "../generated/graphql";
import {UserContext} from "../UserContext";
import {client} from "../utils/Apollo";
import { Indicator } from "./Indicator";

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
            await logout();
            //await logout();
            localStorage.removeItem('user');
            await client.resetStore();
            await client.query({ query: GetUserData, fetchPolicy: "no-cache" });
            history.push("/");
        }
        catch(error) {
            console.error(error);
        }
    }

    return (
        <div className="relative inline-block w-full text-left">
            <Menu>
                {({ open }) => (
                    <>
                        <span className="rounded-md shadow-sm">
                            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:border-gray-900 leading-5 transition duration-150 ease-in-out rounded-md hover:text-gray-500 focus:outline-none active:bg-gray-50 active:text-gray-800 dark:bg-gray-800 dark:text-white">
                                <span className="flex flex-row">
                                    {user.photoUrl &&
                                        <img className="block object-cover w-5 h-5 mr-2 rounded-full lg:inline-block" alt="profile" src={user.photoUrl} />
                                    }
                                    {user.name}
                                    {user.isBeeping && 
                                        <Indicator className="mt-1 ml-2 animate-pulse"/>
                                    }
                                </span>
                                <svg
                                    className="w-5 h-5 ml-2 -mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Menu.Button>
                        </span>

                        <Transition
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                static
                                className="absolute right-0 z-50 w-56 mt-2 bg-white border border-gray-200 shadow-lg outline-none dark:border-gray-900 origin-top-right divide-y divide-gray-100 rounded-md dark:bg-gray-800 dark:divide-gray-700"
                            >
                                <div className="px-4 py-3">
                                    <p className="text-sm leading-5 dark:text-gray-50">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 truncate leading-5 dark:text-gray-100">
                                        @{user.username}
                                    </p>
                                </div>

                                    <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to={`/profile/edit/${user.id}`}
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Edit Account 
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/password/change"
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Change Password
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => handleLogout()}
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Sign out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </div>
    );
}
