FROM node:14

WORKDIR /app

COPY package.json /app

#include this if you get certificate related errors
#RUN npm config set strict-ssl false

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]