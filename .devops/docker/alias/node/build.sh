#!/usr/bin/env bash
set -e

npm install -g @nestjs/cli eslint --force
npm config set unsafe-perm true
npm config set --global update-notifier false
