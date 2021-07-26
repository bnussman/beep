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

## Services
| Service    | URL                           |
|------------|-------------------------------|
| Website    | http://localhost:3000         |
| API        | http://localhost:3001/graphql |
| Expo       | http://localhost:19002        |
| Expo (Web) | http://localhost:19006        |

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
S3_ACCESS_KEY_ID
S3_ACCESS_KEY_SECRET
S3_ENDPOINT_URL
```

Here is an example of my .zshenv

```shell
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=465
export MAIL_USER=banks@nussman.us
export MAIL_PASSWORD=<a real password here>

export S3_ACCESS_KEY_ID=<from Linode>
export S3_ACCESS_KEY_SECRET=<from Linode>
export S3_ENDPOINT_URL=https://us-east-1.linodeobjects.com

export POSTGRESQL_USER=beep
export POSTGRESQL_PASSWORD=<a real password here>
export POSTGRESQL_URL=postgresql://postgresql.nussman.us:5432
export POSTGRESQL_DATABASE=beep
```
