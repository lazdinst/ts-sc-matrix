import { Server as SocketIoServer } from 'socket.io';

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

let io: SocketIoServer;

export const initializeSocketIO = (server: any) => {
  let totalConnections = 0; // Initialize the total connections count

  io = new SocketIoServer(server, {
    cors: {
      origin: allowedOrigins, // Reuse the allowed origins from your Express CORS settings
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log("io Server Created");

  io.on("connection", (socket) => {
    console.log("Client Connected: ", socket.id);
    totalConnections++; // Increment the total connections count
    io.emit('connections', { count: totalConnections }); // Send the updated count to all clients
    socket.on("disconnect", () => {
      totalConnections--; // Increment the total connections count
      io.emit('connections', { count: totalConnections }); // Send the updated count to all clients
      console.log("Client disconnected");
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
