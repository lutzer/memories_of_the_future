# Memories of the Future

## Requirements

* node and npm/npx must be installed
* node version >= 12.x
* audio conversion requires ffmpeg to be installed

## Deployment

### Server

* run `npm install` in web and backend folder
* run `npm run build` in web and backend folder
* run `npm run server` in backend folder

## Development

### Backend
* `cd backend`
* run `npm install`
* run `npm run create-test-data` to create test data and
* run `npm start` to start server in development mode
* `npm test` to run unit tests
* `npm run build` to build server to dist directory

### Web Interface
* `cd web`
* run `npm install`
* run `npm start` to start dev webserver
* build to */web/dist* with `npm run build`