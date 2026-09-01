import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import logger from '../src/utils/logger.js';
import { clearDatabase } from '../seeds/index.js';

async function run() {
  await connectDatabase();
  await clearDatabase();
  logger.info('All MedGPT collections cleared');
  await disconnectDatabase();
}

run().catch((error) => {
  logger.error('Clearing failed', error);
  process.exit(1);
});
