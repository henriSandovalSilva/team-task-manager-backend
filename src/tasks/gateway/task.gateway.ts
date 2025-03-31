import {
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({ cors: true })
  export class TaskGateway {
    @WebSocketServer()
    server: Server;
  
    broadcastTaskStatusUpdate(data: any) {
      this.server.emit('taskStatusChanged', data);
    }
  }
  