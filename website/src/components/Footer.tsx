import React from 'react';

function Footer(props) {
    return (
        <footer className="bg-white pt-10 sm:mt-10 pt-10 flex items-center bottom-0">
            <div className="w-11/12 m-4 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 mb-4">
                <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-left">
                    <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                        <div className="text-xs uppercase text-gray-800 font-medium mb-6">
                            Getting Started
                        </div>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Installation
                        </a>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Release Notes
                        </a>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Upgrade Guide
                        </a>
                    </div>

                    <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                        <div className="text-xs uppercase text-gray-800 font-medium mb-6">
                            Core Concepts
                        </div>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Installation
                        </a>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Release Notes
                        </a>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Upgrade Guide
                        </a>
                    </div>

                    <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                        <div className="text-xs uppercase text-gray-800 font-medium mb-6">
                            Customization
                        </div>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Utility-First
                        </a>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Responsive Design
                        </a>

                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Hover, Focus, & Other States
                        </a>
                    </div>

                    <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                        <div className="text-xs uppercase text-gray-800 font-medium mb-6">
                            Community
                        </div>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            GitHub
                        </a>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Discord
                        </a>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            Twitter
                        </a>
                        <a href="#" className="my-3 block text-gray-600 hover:text-gray-100 text-sm font-medium duration-700">
                            YouTube
                        </a>
                    </div>
                </div>
                <div className="pt-2">
                    <div className="flex pb-5 px-3 m-auto pt-5 
                        border-t border-gray-500 text-gray-800 text-sm 
                        flex-col md:flex-row max-w-6xl">

                        <div className="mt-2">
                            © Ride Beep App - Ian & Banks LLC - All Rights Reserved.
                        </div>

                        <div className="md:flex-auto md:flex-row-reverse mt-2 flex-row flex">
                            <a href="#" className="w-6 mx-1">
                                <i className="uil uil-facebook-f"></i>
                            </a>

                            <a href="#" className="w-6 mx-1">
                                <i className="uil uil-twitter-alt"></i>
                            </a>

                            <a href="#" className="w-6 mx-1">
                                <i className="uil uil-youtube"></i>
                            </a>

                            <a href="#" className="w-6 mx-1">
                                <i className="uil uil-linkedin"></i>
                            </a>

                            <a href="#" className="w-6 mx-1">
                                <i className="uil uil-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
