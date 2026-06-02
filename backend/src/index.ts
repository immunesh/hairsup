import dotenv from 'dotenv';
import app from './app';
import { prisma } from './db/prisma';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);

async function main() {
  await prisma.$connect();
  console.log('Database connected');

  app.listen(PORT, () => {
    console.log(`HairsUp API running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
