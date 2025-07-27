import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../../src/app.module';

describe('PATCH api/v1/produtor', () => {
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
        cpfCnpj: '39295046005',
      })
      .expect(201);

    const input = {
      name: 'Updated Producer Name',
    };

    const result = await request(app.getHttpServer())
      .patch(`/api/v1/producer/${(response.body as { id: string }).id}`)
      .send(input)
      .expect(200);
    expect(result.status).toBe(200);
    expect((result.body as { name: string }).name).toBe(input.name);
  });

  it('With empty name', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: '73357965046',
      })
      .expect(201);
    const input = {
      name: '',
    };

    const result = await request(app.getHttpServer())
      .patch(`/api/v1/producer/${(response.body as { id: string }).id}`)
      .send(input)
      .expect(400);

    expect(result.status).toBe(400);
    expect(
      (result.body as { message: string[] }).message.some((msg: string) =>
        msg.includes('Name must be between 3 and 100 characters long'),
      ),
    ).toBe(true);
  });
});
