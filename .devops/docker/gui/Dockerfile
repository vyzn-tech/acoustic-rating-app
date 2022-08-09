FROM node:16.15.0

USER root
ARG PRODUCTION_BUILD
WORKDIR /var/source
COPY . /var/source
RUN /var/source/.devops/docker/gui/build.sh

WORKDIR /app
CMD runuser -u node -- http-server /app -p 8110
