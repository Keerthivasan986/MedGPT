import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../utils/constants.js';

// Subscribes to server-pushed stock changes for the lifetime of the component.
export default function useStockSocket(onStockUpdate) {
  useEffect(() => {
    const socket = io(API_URL);
    socket.on('stock:updated', onStockUpdate);
    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
