import { teardownTestDatabase } from './setup-testcontainers';

export default async () => {
  await teardownTestDatabase();
};
