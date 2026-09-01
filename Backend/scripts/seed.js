import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import logger from '../src/utils/logger.js';
import seedDatabase from '../seeds/index.js';

async function run() {
  await connectDatabase();
  await seedDatabase();
  await disconnectDatabase();
}

run().catch((error) => {
  logger.error('Seeding failed', error);
  process.exit(1);
});
