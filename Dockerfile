FROM node:latest

# Create app directory
WORKDIR /usr/src/graphql-lowdb-upload-server-example

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Run tests
RUN npm test

EXPOSE 4000

# RUN npm run build

# CMD [ "npm", "run", "serve" ]

CMD [ "npm", "start" ]
