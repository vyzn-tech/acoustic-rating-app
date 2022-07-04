#!/usr/bin/env bash
set -e

runuser -u node -- npm config set unsafe-perm true
runuser -u node -- "$@"
