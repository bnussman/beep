FROM node:current-alpine

WORKDIR /usr/api

COPY api/package.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY api/ .

RUN npx tsc

EXPOSE 3001

CMD [ "node", "build/index.js" ]
