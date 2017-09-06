FROM node:boron

COPY package.json /
RUN npm install

COPY connector.js /
COPY /routes /routes
COPY /public/discovery /public/discovery

ENTRYPOINT [ "npm", "run", "start", "--", "--port=3000" ]
