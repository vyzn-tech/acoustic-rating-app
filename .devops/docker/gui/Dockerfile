FROM node:16.15.0 as build

USER root
ARG PRODUCTION_BUILD
WORKDIR /var/source
COPY . /var/source
RUN /var/source/.devops/docker/gui/build.sh
WORKDIR /app
CMD runuser -u node -- http-server /app -p 8110

FROM nginx:alpine
COPY ./.devops/docker/gui/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app /usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]
