FROM node:16.15.0

USER root
ARG PRODUCTION_BUILD
WORKDIR /var/source
COPY . /var/source
RUN /var/source/.devops/docker/api/build.sh

WORKDIR /app
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD runuser -u node -- npm run start:dev
