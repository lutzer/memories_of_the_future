FROM mhart/alpine-node:14

# install required packages
RUN apk add --no-cache ffmpeg
RUN apk add imagemagick

WORKDIR /usr/src/app

# install dependencies
COPY backend/package*.json backend/
COPY app/package*.json app/
RUN (cd backend && npm install)
RUN (cd app && npm install) 

# copy source code
COPY . .

# run build commands
RUN (cd backend && npm run build)
RUN (cd app && npm run build)

# expose app & admin editor
EXPOSE 3000 3001
WORKDIR /usr/src/app/backend

# start server
CMD ["npm", "run", "server"]