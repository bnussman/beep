FROM node:latest

WORKDIR /usr/api

COPY api/package.json .

RUN npm install && npm install typescript -g

COPY api/ .

RUN npm run build

EXPOSE 3001

CMD [ "node", "build/server.js" ]
