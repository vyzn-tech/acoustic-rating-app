FROM node:16.15.0-bullseye-slim

WORKDIR /var/source
COPY . /var/source
RUN /var/source/.devops/docker/api/build.sh

WORKDIR /app
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD npm run start:dev
