#!/usr/bin/env bash
set -e

if [ ! -f ".devops/devsh/dev.main.sh" ]; then
  git submodule update --init
fi
source .devops/devsh/dev.main.sh

function configure_git() {
  git config core.hooksPath .devops/githooks
  git submodule foreach ''
}

function update_pre_hook() {
  direnv allow . && eval "$(direnv hook bash)" && direnv reload
  configure_git
}

function init_pre_hook() {
  git submodule update --init
  direnv allow . && eval "$(direnv hook bash)" && direnv reload
  docker-alias add
  configure_git
}

run "$@"
