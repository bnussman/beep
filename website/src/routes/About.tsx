import React from 'react';
import {Card} from '../components/Card';

function About() {
    return (
        <div className="dark:bg-black">
        <div className="px-4 mx-auto lg:container">
            <Card>
                <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
                    About Us
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                    Ride beep app is currently a substitute for the facebook page that people use to get around Boone, NC and Appalachian State University. This app allows college students to make money by beeping and allows for an easy and cheap way to get where they want around campus and Boone. The owners are students at App State, Ian Murphy and Banks Nussman, who saw the flaws of the facebook page and wanted to improve the experience with leaving everything that was great about the original idea.
                </p>
            </Card>
            {/*
            <div className="px-5 pt-4 pb-6 overflow-hidden font-mono text-sm subpixel-antialiased leading-normal text-gray-100 bg-gray-800 rounded-lg shadow-lg coding inverse-toggle">
                <div className="flex mb-2 top">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 ml-2 bg-orange-300 rounded-full"></div>
                    <div className="w-3 h-3 ml-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex mt-4">
                    <span className="text-green-400">➜  Beep git:(master)</span>
                    <p className="items-center flex-1 pl-2 typing">
                        created by Banks Nussman
                        <br/>
                        </p>
                    </div>
                </div>
              */}
        </div>
        </div>
    );
}

export default About;
