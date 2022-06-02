#!/usr/bin/env bash
set -e

if [ ! -f ".devops/devsh/dev.main.sh" ]; then
  git submodule update --init
fi
source .devops/devsh/dev.main.sh

function configure_git() {
  git config core.hooksPath .devops/githooks
  git submodule foreach 'if [ -f dev.sh ]; then ./dev.sh init; fi'
}

function update_pre_hook() {
  if ! docker network ls | grep -q "dbs_network" ; then
    docker network create -d bridge --scope=local --attachable=true --label com.docker.compose.network=dbs_network --label com.docker.compose.project=dbs --label com.docker.compose.version=1.29.2 dbs_network
  fi
  direnv allow . && eval "$(direnv hook bash)" && direnv reload
  docker-alias add
  configure_git
}

function init_pre_hook() {
  git submodule update --init
  update
}

run "$@"
