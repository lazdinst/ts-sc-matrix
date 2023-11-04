import { Request, Response, NextFunction } from 'express';
import { Server as SocketIOServer } from 'socket.io';

export const attachIOToRequest = (io: SocketIOServer) => {
  return (req: Request & { io: SocketIOServer }, res: Response, next: NextFunction) => {
    req.io = io;
    next();
  };
};
