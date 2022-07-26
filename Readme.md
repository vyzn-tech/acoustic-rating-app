# acoustic-rating-app

## First Startup
    ./dev.sh init
    docker-compose build
    docker-compose up

## Update Containers and Dependencies (mostly needed after Branch-switching)
    docker-compose build
    ./dev.sh update


## Commands

### Javascript Code Syntax Linting / Fixing
#### API
    npm run lint
#### Frontend
    
### Docker Specific
#### Remove Docker Volumes
    docker-compose down -v
