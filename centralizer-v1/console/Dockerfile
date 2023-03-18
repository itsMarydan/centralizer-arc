# -- BUILD --
FROM node:14-alpine3.16 as build

WORKDIR /usr/src/app

COPY package* ./
COPY . .



RUN npm install
RUN npm run build



# -- RELEASE --
FROM nginx:stable-alpine as release

COPY --from=build /usr/src/app/build /usr/share/nginx/html
# copy .env.example as .env to the release build
COPY --from=build /usr/src/app/.env.example /usr/share/nginx/html/.env
COPY --from=build /usr/src/app/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm install -g runtime-env-cra@0.2.2

WORKDIR /usr/share/nginx/html

EXPOSE 4000 80

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]