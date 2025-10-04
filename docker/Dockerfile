# Build environment
FROM node:lts-alpine AS build
# Create build directory
WORKDIR /usr/src/build
# Install build dependencies
RUN apk update && apk add --no-cache \
    build-base \
    cmake \
    git \
    make \
    python3 \
    py3-pip \
    linux-headers
# Copy package files
COPY package*.json ./
# Install all dependencies (including devDependencies) and build stuff
RUN npm install
# Copy src
COPY . .
# Build
RUN npm run compile

# Production environment
FROM node:lts-alpine
# Create app directory
WORKDIR /usr/src/app
# Copy package files
COPY package*.json ./
# Install production dependencies only (without building)
RUN npm ci --only=production --ignore-scripts
# Copy built stuff
COPY --from=build /usr/src/build/out ./out
# Copy built llama.cpp binaries from build
COPY --from=build /usr/src/build/node_modules/node-llama-cpp ./node_modules/node-llama-cpp
# Run command 
CMD ["npm", "run", "start"]
