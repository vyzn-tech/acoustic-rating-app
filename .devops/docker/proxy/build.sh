#!/usr/bin/env bash
set -e

NGINX_CONFIG_FILE="/etc/nginx/nginx.conf"
NGINX_VHOST_CONFIG_FILE="/etc/nginx/conf.d/default.conf"

cp /var/source/.devops/docker/proxy/config/nginx.conf "$NGINX_CONFIG_FILE"
cp /var/source/.devops/docker/proxy/config/default.conf "$NGINX_VHOST_CONFIG_FILE"

#cleanup
rm -Rf /var/source
