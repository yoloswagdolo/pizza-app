FROM node:18

WORKDIR /usr/src/app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . ./

EXPOSE 3000

CMD [ "npm", "start" ] 