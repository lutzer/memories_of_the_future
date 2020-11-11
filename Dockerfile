FROM mhart/alpine-node:14
RUN apk add  --no-cache ffmpeg
WORKDIR /usr/src/app
# install dependencies
COPY backend/package*.json backend/
COPY app/package*.json app/
RUN (cd backend && npm install --unsafe-perm)
RUN (cd app && npm install) 
# copy source code
COPY . .
# run build commands
RUN (cd backend && npm run build)
RUN (cd app && npm run build)
# expose app & admin editor
EXPOSE 3000 3001
WORKDIR /usr/src/app/backend
CMD ["npm", "run", "server"]