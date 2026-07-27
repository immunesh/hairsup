import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './db/prisma';
import { checkDatabaseEnv } from './lib/checkDatabaseEnv';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function main() {
  checkDatabaseEnv();

  await prisma.$connect();
  console.log('Database connected');

  app.listen(PORT, () => {
    console.log(`HairsUp API running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  // Configuration problems are the developer's to fix, and a stack trace only
  // buries the instructions. Show the message alone; keep the trace for
  // genuine faults.
  if (err instanceof Error && err.message.startsWith('Database not configured')) {
    console.error(`\n${err.message}`);
  } else {
    console.error('Failed to start server:', err);
  }
  process.exit(1);
});
