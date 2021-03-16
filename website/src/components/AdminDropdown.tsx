import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";

export function AdminDropdown() {
    return (
        <div className="relative inline-block text-left">
            <Menu>
                {({ open }) => (
                    <>
                        <span className="rounded-md shadow-sm">
                            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:border-gray-900 leading-5 transition duration-150 ease-in-out rounded-md hover:text-gray-500 focus:outline-none active:bg-gray-50 active:text-gray-800 dark:bg-gray-800 dark:text-white">
                                <span>
                                    Admin
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
                                    <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/admin/users"
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Users
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/admin/beepers"
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Beepers
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/admin/beeps"
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Beeps
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/admin/locations"
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Locations
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/admin/reports"
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Reports
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/admin/rates"
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left dark:text-white`}
                                            >
                                                Rates
                                            </Link>
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
