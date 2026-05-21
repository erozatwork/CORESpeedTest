import { useEffect } from 'react';
import { useSocketStore } from './socket/useSocketStore';

export const useSocketListener = (load) => {
    const { socket } = useSocketStore();
    
    useEffect(() => {
        if (!socket) return;

        socket.on('load data', load);

        return () => {
            socket.off('load data', load);
        };
    }, [socket]);
};