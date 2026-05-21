import { useSocketListener } from "./useSocketListener";
import { useSocketStore } from "./socket/useSocketStore";
import { useInitializer } from "./useInitializer";

export const initializeSocket = (load, key, page) => {
    const socket = useSocketStore((state) => state.socket);

    if(page !== ""){
        socket?.emit(key, page);
    }

    useSocketListener(load);
}

