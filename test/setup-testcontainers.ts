import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';

let postgresContainer: StartedPostgreSqlContainer;

export const setupTestDatabase = async (): Promise<void> => {
  postgresContainer = await new PostgreSqlContainer('postgres:16.0-alpine3.18')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();

  const url = `postgresql://test_user:test_password@${postgresContainer.getHost()}:${postgresContainer.getPort()}/test_db?schema=public`;

  process.env.DATABASE_URL = url;

  execSync('yarn prisma migrate deploy', { stdio: 'inherit' });
};

export const teardownTestDatabase = async (): Promise<void> => {
  if (postgresContainer) {
    await postgresContainer.stop();
  }
};
