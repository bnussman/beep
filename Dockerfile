FROM node:latest

WORKDIR /usr/beep-api-v3

COPY api/package.json .

RUN npm install && npm install typescript -g

COPY api/ .

RUN npm run build

EXPOSE 3001

CMD [ "node", "build/src/server.js" ]
