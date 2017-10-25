FROM node:boron

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "start", "--", "--port=3000" ]
