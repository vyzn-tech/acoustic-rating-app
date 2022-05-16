FROM node:16.15

WORKDIR /var/source
COPY . /var/source
RUN /var/source/.devops/docker/alias/node/build.sh

WORKDIR /app
