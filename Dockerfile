FROM node:14.18.1-alpine3.14 AS development

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

RUN yarn build:css

FROM node:14.18.1-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn --only=production

COPY . .

COPY --from=development /usr/src/app/.next ./.next

COPY --from=development /usr/src/app/styles ./styles

CMD ["yarn", "start"]
