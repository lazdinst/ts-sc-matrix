import { Server as SocketIoServer } from 'socket.io';

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

let io: SocketIoServer;
let TOTAL_CONNECTIONS = 0;

export const initializeSocketIO = (server: any) => {
  io = new SocketIoServer(server, {
    cors: {
      origin: allowedOrigins, // Reuse the allowed origins from your Express CORS settings
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    TOTAL_CONNECTIONS += 1;
    io.emit('connections', { count: TOTAL_CONNECTIONS });
    socket.on("disconnect", () => {
      TOTAL_CONNECTIONS -= 1;
      io.emit('connections', { count: TOTAL_CONNECTIONS });
      console.log("Client disconnected");
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};
