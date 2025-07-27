import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../../src/app.module';

describe('POST api/v1/produtor', () => {
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
        cpfCnpj: '31101816066',
      })
      .expect(201);

    expect(response.status).toBe(201);
  });

  it('With invalid CPF/CNPJ format', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: 'invalid-cpf',
      })
      .expect(400);
    expect(response.status).toBe(400);
    expect(
      Array.isArray((response.body as { message: string[] }).message),
    ).toBe(true);
    expect(
      (response.body as { message: string[] }).message.some((msg: string) =>
        msg.includes('CPF must be 11 digits or CNPJ must be 14 digits'),
      ),
    ).toBe(true);
  });

  it('With invalid CPF/CNPJ value', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: '12365478945',
      })
      .expect(400);
    expect(response.status).toBe(400);
    expect((response.body as { message: string }).message).toEqual(
      'Invalid CPF or CNPJ',
    );
  });

  it('With empty name', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: '',
        cpfCnpj: '31101816066',
      })
      .expect(400);
    expect(response.status).toBe(400);
    expect(
      (response.body as { message: string[] }).message.some((msg: string) =>
        msg.includes('Name must be between 3 and 100 characters long'),
      ),
    ).toBe(true);
  });

  it('With duplicate CPF/CNPJ', async () => {
    const existingProducer = {
      name: 'Existing Producer',
      cpfCnpj: '37429312000125',
    };

    await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send(existingProducer)
      .expect(201);

    const response: request.Response = await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'New Producer',
        cpfCnpj: existingProducer.cpfCnpj,
      })
      .expect(409);

    expect(response.status).toBe(409);
    expect((response.body as { message: string }).message).toEqual(
      'Producer with this CPF/CNPJ already exists',
    );
  });
});
