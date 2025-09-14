# Build environment
FROM node:lts-alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
RUN apk update && apk add --no-cache \
    build-base \
    cmake \
    git \
    make \
    python3 \
    py3-pip \
    linux-headers
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# Copy app
COPY . .
# Build
RUN npm run compile
# Run command 
CMD ["npm", "run", "start"]
