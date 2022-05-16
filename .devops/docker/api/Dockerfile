FROM node:16.15.0-bullseye-slim

WORKDIR /var/source
COPY . /var/source
RUN /var/source/.devops/docker/api/build.sh

WORKDIR /app
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD runuser -u www-data -- npm run start:dev
