import { Server } from 'socket.io';
import env from './env.js';
import logger from '../utils/logger.js';
import { setIO, getIO } from '../sockets/io.js';
import registerStockHandlers from '../sockets/stock.socket.js';

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.clientOrigin, methods: ['GET', 'POST'] }
  });
  setIO(io);

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    registerStockHandlers(io, socket);
    socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`));
  });

  return io;
}

export { getIO };
export default { initSocket, getIO };
