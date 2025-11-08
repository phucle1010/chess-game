"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  return socket;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = getSocket();

    if (socketInstance) {
      socketInstance.on("connect", () => {
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
      };
    }
  }, []);

  return { socket, isConnected };
}
