# Memories of the Future

## Deployment

### with docker
```shell
# clone this repository locally
git clone https://github.com/lutzer/memories_of_the_future.git
# edit docker-compose.yml and set ADMIN_USERNAME and ADMIN_PASSWORD
nano docker-compose.yml
# create docker container
docker-compose build
# run docker container in detached mode
docker-compose up -d

# you can enter the docker container with
docker exec -it motf /bin/sh
```

## Development

### Requirements
* node and npm/npx must be installed
* node version >= 12.x
* audio conversion requires ffmpeg to be installed

### Backend
* `cd backend`
* run `npm install`
* run `npm run create-test-data` to create test data and
* run `npm start` to start server in development mode
* `npm test` to run unit tests
* `npm run build` to build server to dist directory

### App
* `cd app`
* install dependencies: `npm install`
* run `npm start` to start dev app server
* run `npm run build` to build to dist folder
* run `npm test` to run unit tests
