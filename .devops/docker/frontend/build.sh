#!/usr/bin/env bash
set -e

SOURCE_ROOT="/var/source"
$SOURCE_ROOT/.devops/devsh/switch_user.sh "www-data"

#cleanup
rm -Rf "$SOURCE_ROOT"
