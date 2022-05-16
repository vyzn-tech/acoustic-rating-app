#!/usr/bin/env bash
set -e

if [ ! -f ".devops/devsh/dev.main.sh" ]; then
  git submodule update --init
fi
source .devops/devsh/dev.main.sh

function configureGit() {
  git config core.hooksPath .devops/githooks
}

function update_pre_hook() {
  direnv allow . && eval "$(direnv hook bash)"
  configureGit
}

function init_pre_hook() {
  # git submodule update --init
  direnv allow . && eval "$(direnv hook bash)"
  docker-alias add
  configureGit
}

run "$@"
