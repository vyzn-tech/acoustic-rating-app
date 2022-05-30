#!/usr/bin/env bash
set -e

function waitForMysql () {
    MAX_TIMES=300
    TRIED_TIMES=0
    echo "Waiting for mysql"
    until mysqladmin ping -h "$MYSQL_HOST" &> /dev/null
    do
      echo -n -e ". "
      sleep 1
      if [ $((TRIED_TIMES++)) -gt $MAX_TIMES ]; then
        echo ">>> Error! Too many attempts to connect to $MYSQL_HOST"
        exit 1
      fi
    done
}

waitForMysql

runuser -u node -- npm config set unsafe-perm true
runuser -u node -- "$@"
