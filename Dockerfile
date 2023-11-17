FROM node:18-alpine AS base

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN yarn install

