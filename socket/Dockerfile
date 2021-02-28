FROM node:latest

WORKDIR /usr/beep-socket

COPY package.json .

RUN npm install && npm install typescript -g

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "build/index.js" ]
