FROM nginx:latest

WORKDIR /var/source
COPY . /var/source
RUN /var/source/.devops/docker/proxy/build.sh
