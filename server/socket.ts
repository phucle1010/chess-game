import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

interface SocketUser {
  userId: string;
  roomId: string | null;
}

const users = new Map<string, SocketUser>();
let ioInstance: SocketIOServer | null = null;

export function getSocketIO(): SocketIOServer | null {
  return ioInstance;
}

export function initializeSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      // Verify authentication token if needed
      // For now, we'll allow all connections
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Room management
    socket.on("room:join", async (roomId: string) => {
      try {
        await socket.join(roomId);
        socket.to(roomId).emit(`room:player:joined:${roomId}`, {
          socketId: socket.id,
        });
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("room:leave", async (roomId: string) => {
      try {
        await socket.leave(roomId);
        socket.to(roomId).emit(`room:player:left:${roomId}`, {
          socketId: socket.id,
        });
        console.log(`Socket ${socket.id} left room ${roomId}`);
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    });

    // Chat management
    socket.on("chat:join", async (roomId: string) => {
      try {
        await socket.join(`chat:${roomId}`);
        console.log(`Socket ${socket.id} joined chat for room ${roomId}`);
      } catch (error) {
        console.error("Error joining chat:", error);
      }
    });

    socket.on("chat:leave", async (roomId: string) => {
      try {
        await socket.leave(`chat:${roomId}`);
        console.log(`Socket ${socket.id} left chat for room ${roomId}`);
      } catch (error) {
        console.error("Error leaving chat:", error);
      }
    });

    socket.on(
      "chat:send",
      async (data: { roomId: string; message: string }) => {
        try {
          io.to(`chat:${data.roomId}`).emit(
            `chat:message:${data.roomId}`,
            data.message
          );
        } catch (error) {
          console.error("Error sending chat message:", error);
        }
      }
    );

    // Game management
    socket.on(
      "game:move",
      async (data: {
        roomId: string;
        from: string;
        to: string;
        promotion?: string;
      }) => {
        try {
          // Broadcast move to all players in the room
          socket.to(data.roomId).emit(`game:move:${data.roomId}`, {
            from: data.from,
            to: data.to,
            promotion: data.promotion,
          });
        } catch (error) {
          console.error("Error handling game move:", error);
        }
      }
    );

    socket.on(
      "game:start",
      async (data: { roomId: string; gameId: string }) => {
        try {
          io.to(data.roomId).emit(`game:start:${data.roomId}`, {
            gameId: data.gameId,
          });
        } catch (error) {
          console.error("Error starting game:", error);
        }
      }
    );

    socket.on(
      "game:end",
      async (data: { roomId: string; result: "win" | "lose" | "draw" }) => {
        try {
          io.to(data.roomId).emit(`game:end:${data.roomId}`, data.result);
        } catch (error) {
          console.error("Error ending game:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      users.delete(socket.id);
    });
  });

  ioInstance = io;
  return io;
}
