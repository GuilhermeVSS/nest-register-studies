import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../../src/app.module';

describe('GET api/v1/produtor/:id', () => {
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
    const response = await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: '93738937005',
      })
      .expect(201);

    const result = await request(app.getHttpServer())
      .get(`/api/v1/producer/${(response.body as { id: string }).id}`)
      .expect(200);

    expect(result.status).toBe(200);
    expect((result.body as { id: string }).id).toBe(
      (response.body as { id: string }).id,
    );
  });

  it('With unexisting id', async () => {
    const result = await request(app.getHttpServer())
      .get(`/api/v1/producer/non-existing-id`)
      .expect(404);

    expect(result.status).toBe(404);
    expect((result.body as { message: string }).message).toBe(
      'Producer not found',
    );
  });
});
