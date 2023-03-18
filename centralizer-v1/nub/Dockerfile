FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ENV AMQP_URL amqps://cehgnfep:hbsK6k0H8ZQgmodM269z-sCVTsNNcdn3@beaver.rmq.cloudamqp.com/cehgnfep
ENV TESTING false
ENV ENV production
ENV MONGO_HOSTNAME localhost
ENV MONGO_PORT 27017
ENV MONGO_DB centralizer
ENV MONGO_USER admin
ENV MONGO_PWD blueadmin
ENV PORT 8000


COPY package*.json ./

RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]