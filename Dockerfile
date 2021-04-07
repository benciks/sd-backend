FROM node:lts-alpine as BUILDER

RUN apk add --no-cache bash
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN HUSKY_SKIP_INSTALL=1 yarn
COPY . .
RUN yarn compile

FROM node:lts-alpine as PRODUCTION
ENV NODE_ENV=production
EXPOSE 3000
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN HUSKY_SKIP_INSTALL=1 yarn install --production --frozen-lockfile && yarn cache clean

COPY ./reference/ /app/reference/
COPY  /src/service/mail_template/ /app/dist/service/mail_template/
COPY --from=BUILDER /app/dist/ /app/dist/

CMD ["node", "/dist/bootstrap.js"]
