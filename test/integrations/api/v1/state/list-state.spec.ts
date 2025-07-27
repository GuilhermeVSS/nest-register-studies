import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../../src/app.module';

describe('GET api/v1/state', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('With valid data', async () => {
    const result = await request(app.getHttpServer())
      .get(`/api/v1/state`)
      .expect(200);

    expect(result.status).toBe(200);
    expect(Array.isArray(result.body)).toBe(true);
    expect((result.body as Array<{ id: string }>).length).toBeGreaterThan(0);
  });
});
