function plugin_name() {
  echo "api"
}

function cleanup() {
  [ -d node_modules ] || mkdir node_modules
  rm -Rf node_modules/*
}

function init() {
    update
}

function update() {
  cleanup
  npm install
  chmod +x node_modules/.bin/*
}
