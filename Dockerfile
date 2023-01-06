FROM node:18-alpine
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
RUN mkdir -p /var/www/promo
WORKDIR /var/www/promo
ADD . /var/www/promo
RUN npm install
CMD npm start