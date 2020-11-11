# Memories of the Future

## Requirements

* node and npm/npx must be installed
* node version >= 12.x
* audio conversion requires ffmpeg to be installed

## Deployment

### With docker:

```
# clone this repository locally and create docker container
docker build -t drl/motf .
# run container and map private docker ports to public ports
docker run -p 3000:3000 -p 3001:3001 -d drl/motf

# (you can enter the docker container with)
docker exec -it <instanece> /bin/sh
```

## Development

### Backend
* `cd backend`
* run `npm install`
* run `npm run create-test-data` to create test data and
* run `npm start` to start server in development mode
* `npm test` to run unit tests
* `npm run build` to build server to dist directory

### APP
* `cd app`
* install dependencies: `npm install`
* run `npm start` to start dev app server
* run `npm run build` to build to dist folder
* run `npm test` to run unit tests