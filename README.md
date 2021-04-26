# Beep App 🚖

This is the monorepo for the Beep App. Ride beep app is currently a substitute for the facebook page that people use to get around Boone, NC. This app allows college students to make money by beeping and allows for an easy and cheap way to get where they want around campus and Boone. The owners are students at App State, Ian Murphy and Banks Nussman, who saw the flaws of the facebook page and wanted to improve the experience with leaving everything that was great about the original idea.

## Running

### Dependencies

```
sudo apt-get install nodejs
sudo apt-get install npm
```

```
sudo npm install --global yarn
sudo npm install --global expo-cli
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

To run the development envrionment use
```
yarn up
```

### Provide envrionment data

To develop locally please provide the following envrionment varibles
```
POSTGRESQL_USER
POSTGRESQL_PASSWORD
POSTGRESQL_URL
POSTGRESQL_DATABASE
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASSWORD
AWS_ACCESS_KEY_ID
AWS_ACCESS_KEY_SECRET
```

Here is an example of my .zshenv

```
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=465
export MAIL_USER=banks@nussman.us
export MAIL_PASSWORD=<a real password here>

export AWS_ACCESS_KEY_ID=<from AWS>
export AWS_ACCESS_KEY_SECRET=<from AWS>

export POSTGRESQL_USER=banks
export POSTGRESQL_PASSWORD=<a real password here>
export POSTGRESQL_URL=postgresql://postgresql.nussman.us:5432
export POSTGRESQL_DATABASE=beep
```
