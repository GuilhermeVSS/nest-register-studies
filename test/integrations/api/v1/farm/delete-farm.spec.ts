import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../../src/app.module';

interface State {
  id: string;
}

interface Producer {
  id: string;
}

interface Farm {
  id: string;
}

describe('PATCH api/v1/farm', () => {
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
    const { body: states } = (await request(app.getHttpServer())
      .get('/api/v1/state')
      .expect(200)) as { body: State[] };

    const { body: producer } = (await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: '91928625000173',
      })
      .expect(201)) as { body: Producer };

    const farmInput = {
      name: 'Farm Test',
      city: 'City Test',
      stateId: (states[0] as { id: string }).id,
      producerId: (producer as { id: string }).id,
      totalArea: 5.5,
      vegetationArea: 3.5,
      arableArea: 2.0,
    };
    const { body: farm } = (await request(app.getHttpServer())
      .post('/api/v1/farm')
      .send(farmInput)
      .expect(201)) as { body: Farm };

    const response = await request(app.getHttpServer())
      .delete(`/api/v1/farm/${farm.id}`)
      .expect(200);
    expect(response.status).toBe(200);
    expect((response.body as { farmId: string }).farmId).toBe(farm.id);
  });

  it('With unexisting farm', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/v1/farm/69b0e571-90b8-4bb7-ad33-0c45fa7c2692`)
      .expect(404);
    expect(response.status).toBe(404);
    expect((response.body as { message: string }).message).toBe(
      'Farm was not found.',
    );
  });
});
