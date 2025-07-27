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

describe('POST api/v1/farm', () => {
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
        cpfCnpj: '37587681019',
      })
      .expect(201)) as { body: Producer };

    const input = {
      name: 'Farm Test',
      city: 'City Test',
      stateId: (states[0] as { id: string }).id,
      producerId: (producer as { id: string }).id,
      totalArea: 5.5,
      vegetationArea: 3.5,
      arableArea: 2.0,
    };
    const response = await request(app.getHttpServer())
      .post('/api/v1/farm')
      .send(input)
      .expect(201);

    expect(response.status).toBe(201);
  });

  it('With invalid area', async () => {
    const { body: states } = (await request(app.getHttpServer())
      .get('/api/v1/state')
      .expect(200)) as { body: State[] };

    const { body: producer } = (await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: '07766686000175',
      })
      .expect(201)) as { body: Producer };

    const input = {
      name: 'Farm Test',
      city: 'City Test',
      stateId: (states[0] as { id: string }).id,
      producerId: (producer as { id: string }).id,
      totalArea: 5.5,
      vegetationArea: 7.5,
      arableArea: 2.0,
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/farm')
      .send(input)
      .expect(400);

    expect(response.status).toBe(400);
    expect((response.body as { message: string }).message).toEqual(
      'The sum of arable area and vegetation must be equal to the total area.',
    );
  });

  it('With duplicated farm', async () => {
    const { body: states } = (await request(app.getHttpServer())
      .get('/api/v1/state')
      .expect(200)) as { body: State[] };

    const { body: producer } = (await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: '61310623000155',
      })
      .expect(201)) as { body: Producer };

    const input = {
      name: 'Farm Test',
      city: 'City Test',
      stateId: (states[0] as { id: string }).id,
      producerId: (producer as { id: string }).id,
      totalArea: 5.5,
      vegetationArea: 3.5,
      arableArea: 2.0,
    };

    await request(app.getHttpServer())
      .post('/api/v1/farm')
      .send(input)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/api/v1/farm')
      .send(input)
      .expect(409);

    expect(response.status).toBe(409);
    expect((response.body as { message: string }).message).toEqual(
      'A farm with this name already exist for this producer.',
    );
  });
});
