#!/usr/bin/env bash
set -e

function configure_git() {
  git config core.hooksPath .devops/githooks
  git submodule foreach 'if [ -f dev.sh ]; then ./dev.sh init; fi'
}

function init() {
  update
}

availableArguments="init update help"
trap "exit" INT

function update() {
  if ! docker network ls | grep -q "dbs_network" ; then
    docker network create -d bridge --scope=local --attachable=true --label com.docker.compose.network=dbs_network --label com.docker.compose.project=dbs --label com.docker.compose.version=1.29.2 dbs_network
  fi
  configure_git
  (
    cd frontend || exit
    [ -d node_modules ] || mkdir node_modules
    rm -Rf node_modules/*
    npm install
    chmod +x node_modules/.bin/*
  )
  (
    cd api || exit
    [ -d node_modules ] || mkdir node_modules
    rm -Rf node_modules/*
    npm install
    chmod +x node_modules/.bin/*
  )
}

function init() {
    git submodule update --init
    update
}

function help() {
    echo ""
    echo "Usage: $0 [argument]"
    echo ""
    echo "Available arguments:"
    echo "init            init the project and all submodules"
    echo "update          updates all dependencies"
    echo "help            display this"
}

if [[ "$1" == "" ]]; then
    echo "$0 requires at least 1 argument!"
    help
    exit 1
fi

if [[ "$availableArguments" != *"$1"* ]]; then
    echo "Error: unknown argument $1"
    exit 1
fi

"$1" "$2"
