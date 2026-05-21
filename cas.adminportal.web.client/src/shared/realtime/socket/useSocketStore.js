// useSocketStore.js
import { create } from "zustand";
import { io } from "socket.io-client";
import { PATH_WEB_SOCKET } from "@shared/config/api.config";
import { initialSocketState } from "../state";

export const useSocketStore = create((set, get) => ({
  ...initialSocketState,
  connect: (user) => {
    if (!user) return;

    const socket = io(PATH_WEB_SOCKET, {
      autoConnect: false,
      auth: { userId: user.employeeNumber },
    });

    socket.connect();

    set({ socket });
  },
  disconnect: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null });
  },
}));
