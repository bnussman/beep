import { Card } from '../components/Card';

function About() {
    return (
        <div className="mx-auto lg:container">
            <Card>
                <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
                    About Us
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                    Ride beep app is currently a substitute for the facebook page that people use to get around Boone, NC and Appalachian State University. This app allows college students to make money by beeping and allows for an easy and cheap way to get where they want around campus and Boone. The owners are students at App State, Ian Murphy and Banks Nussman, who saw the flaws of the facebook page and wanted to improve the experience with leaving everything that was great about the original idea.
                </p>
            </Card>
        </div>
    );
}

export default About;
