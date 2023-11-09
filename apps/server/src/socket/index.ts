import { Server as SocketIoServer } from 'socket.io';

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

let io: SocketIoServer;

export const initializeSocketIO = (server: any) => {
  let totalConnections = 0;

  io = new SocketIoServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log("io Server Created");

  io.on("connection", (socket) => {
    console.log("New Client Connected: ", socket.id);
    totalConnections++;
    console.log("emmitting message to client", totalConnections);
    io.emit('message', 'Hello, World!!');
    io.emit('connections', { count: totalConnections });
    socket.on("disconnect", () => {
      totalConnections--;
      io.emit('connections', { count: totalConnections });
      console.log("Client disconnected");
    });
    socket.on("roll", () => {
      console.log('Rolled')
    });
  });

  // Add error handling for the Socket.IO server
  io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });

};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};
