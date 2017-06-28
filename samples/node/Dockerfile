FROM node:boron

COPY package.json /
RUN npm install

COPY connector.js /


ENTRYPOINT [ "npm", "run", "start", "--", "--port=3000" ]
