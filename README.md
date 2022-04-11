# Beep App 🚖

## 📚 Introduction

This is the monorepo for the Beep App. Ride beep app is currently a substitute for the facebook page that people use to get around Boone, NC. This app allows college students to make money by beeping and allows for an easy and cheap way to get where they want around campus and Boone. The owners are students at App State, Ian Murphy and Banks Nussman, who saw the flaws of the facebook page and wanted to improve the experience with leaving everything that was great about the original idea.

### 💻 Tech Stack
- API
  - Apollo GraphQL
  - PostgreSQL (PostGIS)
  - Mikro-ORM
  - TypeGraphQL
  - Linode S3 Object Storage
  - Redis
- App
  - React Native
  - Expo
  - UI-Kitten (soon to become Native Base)
  - Apollo Client
- Website
  - React
  - Chakra UI
  - Apollo Client

## ⌨️ Developing Locally

### Dependencies

- Node.js (Install with [Volta](https://volta.sh/))
- npm (Install with [Volta](https://volta.sh/))
- Yarn (Install with [Volta](https://volta.sh/))
- Docker
- [docker-compose](https://docs.docker.com/compose/install/#install-compose)
- Expo CLI (`npm install --global expo-cli`)

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

Bring local db and redis up with Docker
```
docker-compose up -d
```

Setup DB scheme (go to the `api/` folder)
```
npx mikro-orm schema:create --run
```

To run the development envrionment use
```
yarn dev
```

### Provide envrionment data

> ⚠️ For develpment envrionment to start successfully, you must provide these envrionment varibles

```
POSTGRESQL_USER
POSTGRESQL_PASSWORD
POSTGRESQL_URL
POSTGRESQL_DATABASE
REDIS_HOST
REDIS_PASSWORD
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

export REDIS_HOST=redis.staging.nussman.us
export REDIS_PASSWORD=<a real password here>
```

You can also create a `.env` in `api/` to set the API's env. (`vim api/.env`)

```env
S3_ACCESS_KEY_ID=hkjvbyuverbvugfreukgsig
S3_ACCESS_KEY_SECRET=hwgyeeurkgufgkerbvyrue
S3_ENDPOINT_URL=https://us-east-1.linodeobjects.com
GOOGLE_API_KEYS="["jgfhwgqjkfgwegjfgwekfegy","ghejfqwuguyiqfgvuyvu"]"
```

### Services running for local development
| Service    | URL                           |
|------------|-------------------------------|
| Website    | http://localhost:3000         |
| API        | http://localhost:3001/graphql |
| Expo       | http://localhost:19002        |
| Expo (Web) | http://localhost:19006        |

## ❔ FAQs

Who owns Ride Beep App?
> Ian & Banks LLC founded by Banks Nussman and Ian Murphy

What database is used?
> PostgreSQL

Why is Redis used?
> Redis is currently only used to enable GraphQL subscriptions accross multiple instances of the API for scaling purposes

What is in this repo?
> A React Native (with Expo) iOS and Android app, a React website, and a GraphQL API

Why is the README.md so cringe?
> Had to make it this format for a class

## ⚠️ Troubleshooting

Use `yarn clean` to clear all dependencies in the project's repository

Leave an [issue](https://gitlab.nussman.us/beep-app/beep/-/issues) to get support on installing, developing, and running locally.

## 👏 Contribute

Open an [issue](https://gitlab.nussman.us/beep-app/beep/-/issues) or create a [pull request](https://gitlab.nussman.us/beep-app/beep/-/merge_requests/new)

## 🚓 License

The project is licensed under the Apache 2.0 Licence 

