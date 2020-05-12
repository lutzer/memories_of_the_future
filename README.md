# Memories of the Future

## Requirements

* node and npm/npx must be installed
* node version >= 12.x
* audio conversion requires ffmpeg to be installed

## Deployment

### Server

*TODO: write deploy script*

* run `npm install` in web and backend folder
* run `npm run build` in web and backend folder
* run `npm run server` in backend folder

### App
* run `npm install` in app folder
* run `npm run deploy` in app folder

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
* run `npm start` to start webpack dev webserver
* build to dist dir with `npm run build`

### App
* `cd app`
* install cordova: `npm install cordova -g`
* install dependencies: `npm install`
* cordova requirements for android: https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html
  * change path env vars JAVA_HOME, ANDROID_HOME, PATH
  * install gradle: `brew install gradle`
  * add to path: `export PATH=$PATH:/usr/local/Cellar/gradle/6.4`
* run `npm start` to start dev app server
* run `npm run build-android` to build cordova app
* run `npm run browser` to serve the build app in the browser
* run `npm run android` to serve the build app in android emulator