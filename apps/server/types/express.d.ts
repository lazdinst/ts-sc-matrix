// apps\server\types\express.d.ts
import { Server as SocketIoServer } from 'socket.io';

declare module 'express-serve-static-core' {
  interface Request {
    io: SocketIoServer;
  }
}
