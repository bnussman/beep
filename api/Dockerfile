FROM node:current-alpine

WORKDIR /usr/beep-api-v3

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD [ "node", "build/src/server.js" ]
