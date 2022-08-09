# acoustic-rating-app

## Getting started
### Dependencies
    git
    node
    npm
    docker [optional]
    docker-compose [optional]

### Dependencies for Windows with Docker-Desktop
    extra WSL2-Machine like Ubuntu:20.04
    git, node and npm inside WSL2-Machine

**This Project is using File-Watchers and Docker-Volumes.**
**Working with Docker-Volumes at a remoted Windows path like C:/Users/user_name/repo_name will decrease the performance dramatically! Therefore, we strongly recommend to follow [Docker-Desktop's best practices](https://docs.docker.com/desktop/windows/wsl/#best-practices)**

- Clone this Project inside your WSL2-Machine at a non remoted Windows path.
- E.g.: WSL2-Machine named `ubuntu` -> `/home/user_name/repo_name`
- Files are available via `\\wsl$\ubuntu\home\user_name\repo_name` at Windows
- Use the WSL2-Machine's Terminal (Because e.g.: Git-Bash and Cygwin can't resolve `\\wsl$\ubuntu`)

## Application Startup
### Containerized, Automated
#### First Initialization
    ./dev.sh init
    docker-compose build
    docker-compose up

#### Update Containers and Dependencies after Branch-switching
    docker-compose down
    ./dev.sh update
    docker-compose build
    docker-compose up

### Containerized, Manual (E.g.: if bash is not available)
#### First Initialization
1. If not exist, create dbs-core Docker-Network
   1. `docker network create -d bridge --scope=local --attachable=true --label com.docker.compose.network=dbs_network --label com.docker.compose.project=dbs --label com.docker.compose.version=1.29.2 dbs_network`
2. Init Git-Submodules: `git submodule update --init`
3. Configure Git-Hooks
   1. `git config core.hooksPath .devops/githooks`
   2.  cd into `service/libs/acoustic-rating-calculator` and execute `git config core.hooksPath .devops/githooks`
4. Install node_modules
   1. cd into directory `api` and execute `npm install`
   2. cd into directory `frontend` and execute `npm install`


    docker-compose build
    docker-compose up

#### Update Dependencies after Branch-switching
1. Update Git-Submodules `git submodule update --init`
2. Remove node_modules from directories `api` and `frontend`
4. Reinstall node_modules
   1. cd into `api` and execute `npm install`
   2. cd into `frontend` and execute `npm install`


    docker-compose down
    docker-compose build
    docker-compose up

### Local, Manual (no connection to dbs-core)
#### First Initialization
1. Init Git-Submodules `git submodule update --init`
4. Install node_modules
   1. cd into `api` and execute `npm install`
   2. cd into `frontend` and execute `npm install`
3. Start GUI service `npm run start`
4. Start Backend service `npm run start:dev`

## Ports
The app is reachable at `http://localhost:8110`

## Other Commands

#### Javascript Code Syntax Linting / Fixing
    npm run lint

