# Beep App 🚖

This is the monorepo for the Beep App. Ride beep app is currently a substitute for the facebook page that people use to get around Boone, NC. This app allows college students to make money by beeping and allows for an easy and cheap way to get where they want around campus and Boone. The owners are students at App State, Ian Murphy and Banks Nussman, who saw the flaws of the facebook page and wanted to improve the experience with leaving everything that was great about the original idea.

## Running

### Dependencies

Make sure you are using a supported version of Node.js (14.5.4 is recommended). We recommend using [NVM](https://github.com/nvm-sh/nvm)
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
## You may need to open a new terminal window
nvm install 14.15.4
nvm use 14.15.4
node --version
```

```
sudo apt-get install npm
sudo npm install --global yarn
```

### Running Locally

Clone this repository
```
git clone https://gitlab.nussman.us/beep-app/beep.git
```
Go into the projects directory
```
cd beep
```

Install dependencies
```
yarn
```

To Run the whole development envrionment use
```
yarn up
```

To run just one service use
```
yarn start:website
```
