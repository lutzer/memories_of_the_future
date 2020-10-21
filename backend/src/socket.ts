import io from 'socket.io';
import { Server } from 'http';

function connectSocket(server : Server) {
  const socketIo = io(server)
  
  socketIo.on('connection', (socket) => {
    socket.emit('project-updated', { test: 'test' })
  })

  return socketIo
  // socketIo.sockets.emit('project')
}

function sendUpdate(server : io.Server, { 
  projectId, storyId = null, attachmentId = null
} : {projectId : string, storyId? : string, attachmentId? : string}) {
  server.emit('/update/project/' + projectId, { storyId, attachmentId } )
}

export { connectSocket, sendUpdate }