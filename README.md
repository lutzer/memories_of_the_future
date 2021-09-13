# Memories of the Future

## Deployment

### with docker
```shell
# clone this repository locally
git clone https://github.com/lutzer/memories_of_the_future.git
# edit docker-compose.yml and set ADMIN_USERNAME and ADMIN_PASSWORD
nano docker-compose.yml
# build docker image
docker-compose build
# run docker container in detached mode
docker-compose up -d

# you can enter the docker container with
docker exec -it memories_of_the_future_server_1 /bin/sh
```

## Development

### Requirements
* node and npm/npx must be installed
* node version >= 12.x
* audio conversion requires ffmpeg to be installed
* image compression requires imagemagick to be installed

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

### TODO

* [x] IPhone Media Recorder fixen, absoielen geht, aufnahme nicht
* entfernen von eintrag mit fehlerhaftem bild
* [x] mozilla map groesse fixen
* [ ] mozilla data storage problem
* [ ]ortungs punkt einfuegen
- [ ] Map —> ursprünglich sollte die Monochrome Map zu diesem Design, allerdings gefällt mir der Stil mit der bunten Map sehr gut. Euch auch? Lassen wir es so?
* [?]Die Farbpalette der Punkte gefällt mir noch nicht. Ich würde nochmal eine Variante mit nur RGB Farben zusammen stellen.
* [x] Probleme mit unterschiedlichen Browsern. Z.B. sind die Texte bei mir bei Firefox nicht im Blocksatz und es kommt eine Fehlermeldung wenn ich Bilder hochladen will.
* [ ] Location Button fehlt noch
* [x] Wie sieht das mini symbol der app aus? (Also das kleine Symbol wenn man die app auf den Bildschirm lädt oder das symbol oben in der Tableiste
* [ ] Upload von Firefox Bildern geht nicht