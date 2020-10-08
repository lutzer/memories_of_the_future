
import io from 'socket.io-client';
import { config } from '../config';

class Socket {

  static connect() : Promise<SocketIOClient.Socket> {
    const socket = io('http://localhost:' + config.backendPort);
    return new Promise<SocketIOClient.Socket>( (resolve, reject) => {
      socket.on('connect', () => resolve(socket))
      socket.on('error', (err : Error) => reject(err))
    })
  }
}

export { Socket }