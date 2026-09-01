let io = null;

export function setIO(instance) {
  io = instance;
}

export function getIO() {
  if (!io) throw new Error('Socket.IO has not been initialised yet');
  return io;
}
