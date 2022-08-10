#!/usr/bin/env bash
set -e

SOURCE_ROOT="/var/source"
WEB_ROOT="/app"

if [ "$PRODUCTION_BUILD" == "true" ]; then
    (
        cd "$SOURCE_ROOT/frontend" || exit
        npm install --unsafe-perm
        npm run build
        cp -r "build" "$WEB_ROOT"
        chown -Rf node:node "$WEB_ROOT"
    )
fi

#cleanup
rm -Rf "$SOURCE_ROOT"

