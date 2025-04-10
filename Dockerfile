FROM node:16.13.0 AS builder

WORKDIR /home/node

COPY --chown=node:node package*.json yarn.lock ./

COPY --chown=node:node . .

ARG BUILD_EXPIRE
ARG BUILD_DOMAIN
ARG REACT_APP_SENTRY_KEY=${REACT_APP_SENTRY_KEY:-""}
ARG REACT_APP_SENTRY_ORGANIZATION=${REACT_APP_SENTRY_ORGANIZATION:-""}
ARG REACT_APP_SENTRY_PROJECT=${REACT_APP_SENTRY_PROJECT:-""}

RUN npm i -g yarn --force

USER node

ENV REACT_APP_SENTRY_KEY=${REACT_APP_SENTRY_KEY}
ENV REACT_APP_SENTRY_ORGANIZATION=${REACT_APP_SENTRY_ORGANIZATION}
ENV REACT_APP_SENTRY_PROJECT=${REACT_APP_SENTRY_PROJECT}

RUN yarn install --force --frozen-lockfile --network-timeout=600000
RUN ./scripts/build.sh

FROM nginx:mainline-alpine

COPY --from=builder /home/node/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
