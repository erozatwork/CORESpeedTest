import { useEffect } from "react";
import { useSocketStore } from "./socket/useSocketStore";
import { useAuthContext } from "@features/auth/useAuthContext";

export const useInitializer = () => {
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated && user) {
      connect(user);
    }
    return () => disconnect();
  }, [connect, disconnect, isAuthenticated, user]);
};
