FROM node:16.15.0

WORKDIR /var/source
COPY . /var/source
RUN /var/source/.devops/docker/frontend/build.sh

CMD runuser -u www-data -- npm run start
