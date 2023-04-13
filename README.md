# Beep App 🚖

![ci](https://github.com/bnussman/beep/actions/workflows/ci.yml/badge.svg)
![staging](https://github.com/bnussman/beep/actions/workflows/staging.yml/badge.svg)
![production](https://github.com/bnussman/beep/actions/workflows/production.yml/badge.svg?branch=production)


## 📚 Introduction

This is the monorepo for the Beep App. The *Beep App* is a full stack ride share application. This app is built for students at college campuses and currently is mostly used by students at Appalachian State University. This application is not afilliated with any university and is independently developed and maintained.

## ⌨️ Developing Locally

### Dependencies

- Node.js (Install with [Volta](https://volta.sh/))
- pnpm
- Docker
- [docker-compose](https://docs.docker.com/compose/install/#install-compose)
- Expo CLI

### 💻 Running Locally

Fork this repository
```
git clone <url of your fork>
```

Go into the projects directory
```
cd beep
```

Install dependencies
```
pnpm i
```

Bring local db and redis up with Docker
```
docker-compose up -d
```

Create the database schema (run this in the `api/` directory)
```
pnpm db:create
```

To run the development envrionment use in the repo's root
```
pnpm dev
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
| API        | http://localhost:3001/graphql |
| Website    | http://localhost:5173         |
| App        | http://localhost:19000        |

## ⚠️ Troubleshooting

- Use `pnpm clean` to clear all dependencies in the project's repository
- Run `pnpm` in the repo's root to install dependences

## 🚀 Standing up a new environment

1. Create new Github Environment
2. Create Kubernetes Cluster
3. Create Database
4. Create Redis Instance
5. Configure Secrets in Github
6. Create new Github Actions workflow
7. Deploy to Kubernetes by pushing to specified branch
    - After the `beep` namespace has been created, you must add a TLS secrets so that the Linode NodeBalancer can deploy
    - `sudo kubectl --kubeconfig ~/Downloads/dev-kubeconfig.yaml create secret tls cert --cert /etc/letsencrypt/live/dev.ridebeep.app/fullchain.pem --key /etc/letsencrypt/live/dev.ridebeep.app/privkey.pem --namespace beep`
8. Update Cloudflare to point to Linode NodeBalancer

## 📈 Stats
![Alt](https://repobeats.axiom.co/api/embed/1b46a8057ec1f00f48ce7a9fbe9353c7cbe4ff83.svg "Repobeats analytics image")
