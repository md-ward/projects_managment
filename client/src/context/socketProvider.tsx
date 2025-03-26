import { useAuthStore } from "@/state/auth";
import { cookies } from "next/headers";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  sockets: Record<string, Socket>; // Store multiple sockets
  isConnected: (key: string) => boolean; // Check if a socket is connected
};

type SocketContextProviderProps = {
  children: React.ReactNode;
  socketUrls: string[]; // Array of socket URLs
};

export const SocketContext = createContext<SocketContextType | null>(null);
export const SocketContextProvider = ({
  children,
  socketUrls,
}: SocketContextProviderProps) => {
  const [sockets, setSockets] = useState<Record<string, Socket>>({});
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    if (currentUser === null || currentUser === undefined)
      return; // Wait for user data to be available
    else {
      const newSockets: Record<string, Socket> = {};

      socketUrls.forEach((url) => {
        if (!newSockets[url]) {
          const socket = io(url, {
            autoConnect: true,
            query: { user: currentUser.username },
          });

          socket.on("connect", () => {
            console.log(`Connected to ${url}`);
          });

          socket.on("disconnect", () => {
            console.log(`Disconnected from ${url}`);
          });

          newSockets[url] = socket;
        }
      });

      setSockets(newSockets);

      return () => {
        Object.values(newSockets).forEach((socket) => socket.disconnect());
      };
    }
  }, [socketUrls, currentUser]); // Depend on `user` so sockets initialize only when user data is available

  const isConnected = (key: string) => !!sockets[key]?.connected;

  return (
    <SocketContext.Provider value={{ sockets, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom Hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};
