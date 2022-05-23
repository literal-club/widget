FROM nginx:alpine as runner

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*

COPY widget.js .
