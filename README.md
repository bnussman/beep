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
- Bun (the API runs on Bun)
- Node.js (still working on migrating to Bun)
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

### 🌎 Services running for local development
| Service    | URL                           |
|------------|-------------------------------|
| API        | http://localhost:3000/graphql |
| Website    | http://localhost:5173         |
| App        | http://localhost:8081         |
