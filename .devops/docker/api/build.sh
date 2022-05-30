#!/usr/bin/env bash
set -e

SOURCE_ROOT="/var/source"
$SOURCE_ROOT/.devops/devsh/switch_user.sh "node"

apt-get -qq update
apt-get -qq install default-mysql-client procps -y

cp "$SOURCE_ROOT/.devops/docker/api/config/entrypoint.sh" /usr/local/bin

#cleanup
rm -Rf "$SOURCE_ROOT"
