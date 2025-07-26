import { Test, TestingModule } from '@nestjs/testing';
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
    await app.init();
  });

  it('With valid data', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/produtor')
      .send({})
      .expect(201);
      
      expect(response.status).toBe(201);
    });

});
