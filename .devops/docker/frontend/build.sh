#!/usr/bin/env bash
set -e

SOURCE_ROOT="/var/source"
$SOURCE_ROOT/.devops/devsh/switch_user.sh "node"

apt-get -qq update
apt-get -qq install procps -y

#cleanup
rm -Rf "$SOURCE_ROOT"
