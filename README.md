# Beep App 🚖

![ci](https://github.com/bnussman/beep/actions/workflows/ci.yml/badge.svg)
![staging](https://github.com/bnussman/beep/actions/workflows/staging.yml/badge.svg)
![production](https://github.com/bnussman/beep/actions/workflows/production.yml/badge.svg)


## 📚 Introduction

This is the monorepo for the Beep App. Ride beep app is currently a substitute for the facebook page that people use to get around Boone, NC. This app allows college students to make money by beeping and allows for an easy and cheap way to get where they want around campus and Boone. The owners are students at App State, Ian Murphy and Banks Nussman, who saw the flaws of the facebook page and wanted to improve the experience with leaving everything that was great about the original idea.

## ⌨️ Developing Locally

### Dependencies

- Node.js (Install with [Volta](https://volta.sh/))
- npm (Install with [Volta](https://volta.sh/))
- Yarn (Install with [Volta](https://volta.sh/))
- Docker
- [docker-compose](https://docs.docker.com/compose/install/#install-compose)
- Expo CLI (`npm install --global expo-cli`)

### 💻 Running Locally

Clone this repository
```
git clone git@github.com:bnussman/beep.git
```

Go into the projects directory
```
cd beep
```

Install dependencies
```
yarn
```

Install Expo dependencies and link them (run this in the `app/` directory)
```
expo install
```

Bring local db and redis up with Docker
```
docker-compose up -d
```

Create the database schema (run this in the `api/` directory)
```
yarn db:create
```

To run the development envrionment use in the repo's root
```
yarn dev
```

By default, the api will use your local database and redis from docker. You should not need an `.env` to develop locally
You can create a `.env` in `api/` to set the API's env. (`vim api/.env`)

```env
S3_ACCESS_KEY_ID=hkjvbyuverbvugfreukgsig
S3_ACCESS_KEY_SECRET=hwgyeeurkgufgkerbvyrue
S3_ENDPOINT_URL=https://us-east-1.linodeobjects.com
GOOGLE_API_KEYS="["jgfhwgqjkfgwegjfgwekfegy","ghejfqwuguyiqfgvuyvu"]"
```

### 🌎 Services running for local development
| Service    | URL                           |
|------------|-------------------------------|
| Website    | http://localhost:5173         |
| API        | http://localhost:3001/graphql |
| Expo       | http://localhost:19002        |
| Expo (Web) | http://localhost:19006        |

## ⚠️ Troubleshooting

- Use `yarn clean` to clear all dependencies in the project's repository
- Run `yarn` in the repo's root to install dependences
- Run `expo install` in the `app/` directory

## 📈 Stats
![Alt](https://repobeats.axiom.co/api/embed/1b46a8057ec1f00f48ce7a9fbe9353c7cbe4ff83.svg "Repobeats analytics image")

## 🚓 License

This project is licensed under the Apache 2.0 Licence.

