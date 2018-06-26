FROM node:alpine AS build
ENV APP_DIR="/app"
WORKDIR "$APP_DIR"
COPY [".", "$APP_DIR"]
RUN yarn install && yarn build:prod

FROM node:alpine
ENV APP_DIR="/app"
WORKDIR "$APP_DIR"
RUN npm uninstall -g npm
COPY --from=build ["$APP_DIR/package.json", "$APP_DIR/index.js", "$APP_DIR/"]
CMD ["node", "."]
