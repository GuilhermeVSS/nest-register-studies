import { setupTestDatabase } from './setup-testcontainers';

export default async () => {
  await setupTestDatabase();
};
