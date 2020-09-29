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

export { connectSocket }