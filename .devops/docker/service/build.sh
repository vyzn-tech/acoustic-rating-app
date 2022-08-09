#!/usr/bin/env bash
set -e

SOURCE_ROOT="/var/source"
WEB_ROOT="/app"

cp "$SOURCE_ROOT/.devops/docker/service/config/entrypoint.sh" /usr/local/bin

if [ "$PRODUCTION_BUILD" == "true" ]; then
    (
        cp -r "$SOURCE_ROOT/api" "$WEB_ROOT"
        cd "$WEB_ROOT" || exit
        npm install --unsafe-perm
        chown -Rf node:node "$WEB_ROOT"
    )
fi

#cleanup
rm -Rf "$SOURCE_ROOT"
