import http from 'http';
import env from './config/env.js';
import createApp from './app.js';
import { connectDatabase } from './config/database.js';
import { initSocket } from './config/socket.js';
import logger from './utils/logger.js';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.port, () => logger.info(`MedGPT API ready on http://localhost:${env.port}`));

  const shutdown = (signal) => {
    logger.warn(`${signal} received — shutting down`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
