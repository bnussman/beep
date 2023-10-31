# Beep App 🚕

![ci](https://github.com/bnussman/beep/actions/workflows/ci.yml/badge.svg)
![e2e](https://github.com/bnussman/beep/actions/workflows/e2e.yml/badge.svg)

![dev](https://github.com/bnussman/beep/actions/workflows/dev.yml/badge.svg)
![staging](https://github.com/bnussman/beep/actions/workflows/staging.yml/badge.svg)
![production](https://github.com/bnussman/beep/actions/workflows/production.yml/badge.svg?branch=production)


## 📚 Introduction

This is the monorepo for the Beep App. The *Beep App* is a full stack ride share application. This app is built for students at college campuses and currently is mostly used by students at Appalachian State University. This application is not afilliated with any university and is independently developed and maintained.

## ⌨️ Developing Locally

### Dependencies

#### Required
- Node.js
- pnpm
- Docker Compose

#### Optional
- EAS CLI

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

By default, the api will use your local database, redis, and s3 server from docker. You should not need an `.env` to develop locally
You can create a `.env` in `api/` to set the API's env if needed. (`vim api/.env`)

```env
S3_ACCESS_KEY_ID=hkjvbyuverbvugfreukgsig
S3_ACCESS_KEY_SECRET=hwgyeeurkgufgkerbvyrue
S3_ENDPOINT_URL=https://us-east-1.linodeobjects.com
GOOGLE_API_KEYS="["jgfhwgqjkfgwegjfgwekfegy","ghejfqwuguyiqfgvuyvu"]"
```

### 🌎 Services running for local development
| Service    | URL                           |
|------------|-------------------------------|
| API        | http://localhost:3000/graphql |
| Website    | http://localhost:5173         |
| App        | http://localhost:8081         |

## 🚀 Standing up a new environment

1. Create new Github Environment
2. Create Kubernetes Cluster
3. Create Database
4. Create Redis Instance
5. Configure Secrets in Github
6. Create new Github Actions workflow
7. Deploy to Kubernetes by pushing to specified branch 
    - After the `beep` namespace has been created, you must add a TLS secrets so that the Linode NodeBalancer can deploy
    - Generate a cert with `sudo certbot certonly --manual --preferred-challenges=dns --email banks@nussman.us --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -d api.dev.ridebeep.app`
    - Set cert in Kubernetes `sudo kubectl --kubeconfig ~/Downloads/dev-kubeconfig.yaml create secret tls cert --cert /etc/letsencrypt/live/api.dev.ridebeep.app/fullchain.pem --key /etc/letsencrypt/live/api.dev.ridebeep.app/privkey.pem --namespace beep`
9. Update Cloudflare to point to Linode NodeBalancer

## 🔒 Secrets
This section outlines all environment variables / secrets needed to run the app in production

### App
| Secret                   | Description                                                                  | Example                               |
|--------------------------|------------------------------------------------------------------------------|---------------------------------------|
| `EXPO_TOKEN`             | Used by Github Actions to deploy updates                                     |                                       |

### Website
| Secret                   | Description                                                                  | Example                               |
|--------------------------|------------------------------------------------------------------------------|---------------------------------------|
| `VITE_GOOGLE_API_KEY`    | A Google API key for Maps                                                    |                                       |
| `VITE_ENVIRONMENT_NAME`  | A environment name so the site knows which API URL to use                    | `production`                          |

### API
| Secret                 | Description                                                                  | Example                                                |
|------------------------|------------------------------------------------------------------------------|--------------------------------------------------------|
| `DB_CA`                | A CA Cerrtificate to connnect to the PostgreSQL database                     |                                                        |
| `DB_PASSWORD`          | A password for the PostgreSQL database                                       |                                                        |
| `DB_URL`               | A PostgreSQL database URL in the form                                        | `postgresql://localhost:5432`                          |
| `DB_USER`              | A PostgreSQL database user                                                   |                                                        |
| `ENVIRONMENT_NAME`     | A environment name used to help the server know what links to use in emails  | `production`                                           |
| `KUBE_CONFIG`          | A kubeconfig for the Kubernetes cluster that will host the API               |                                                        |
| `REDIS_HOST`           | A hostname or IP of the Redis server                                         |                                                        |
| `REDIS_PASSWORD`       | A password for the Redis server                                              |                                                        |
| `MAIL_HOST`            | The hostname of the email server                                             |                                                        |
| `MAIL_PORT`            | The port of the email server                                                 |                                                        |
| `MAIL_PASSWORD`        | The password for the email account                                           |                                                        |
| `MAIL_USER`            | The username or email of the email account used to send emails               |                                                        |
| `S3_ACCESS_KEY_ID`     | The S3 access key ID                                                         |                                                        |
| `S3_ACCESS_KEY_SECRET` | The S3 access key secret                                                     |                                                        |
| `S3_ENDPOINT_URL`      | The S3 server URL                                                            | `https://us-east-1.linodeobjects.com`                  |
| `SENTRY_URL`           | The Sentry DSN                                                               |                                                        |
| `GOOGLE_API_KEYS`      | A JSON array of Google Maps/Directions API keys                              | `["jgfhwgqjkfgwegjfgwekfegy","ghejfqwuguyiqfgvuyvu"]`  |
| `DOCKERHUB_TOKEN`      | Docker Hub Token so Github Actions can upload API server images              |                                                        |
| `DOCKERHUB_USERNAME`   | Docker Hub Username so Github Actions can upload API server images           |                                                        |'

## 📈 Stats
![Alt](https://repobeats.axiom.co/api/embed/1b46a8057ec1f00f48ce7a9fbe9353c7cbe4ff83.svg "Repobeats analytics image")
