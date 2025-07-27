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
        cpfCnpj: '57600898039',
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

    const input = {
      name: 'New Name',
      totalArea: 7.5,
      vegetationArea: 5.5,
      arableArea: 2.0,
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/v1/farm/${farm.id}`)
      .send(input)
      .expect(200);
    expect(response.status).toBe(200);
    expect((response.body as { name: string }).name).toBe('New Name');
  });

  it('With invalid new area', async () => {
    const { body: states } = (await request(app.getHttpServer())
      .get('/api/v1/state')
      .expect(200)) as { body: State[] };

    const { body: producer } = (await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: '79629196042',
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

    const input = {
      name: 'New Name',
      totalArea: 7.5,
      vegetationArea: 15.5,
      arableArea: 2.0,
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/v1/farm/${farm.id}`)
      .send(input)
      .expect(400);
    expect(response.status).toBe(400);
    expect((response.body as { message: string }).message).toBe(
      'The sum of arable area and vegetation must be equal to the total area.',
    );
  });

  it('With invalid conflict name', async () => {
    const { body: states } = (await request(app.getHttpServer())
      .get('/api/v1/state')
      .expect(200)) as { body: State[] };

    const { body: producer } = (await request(app.getHttpServer())
      .post('/api/v1/producer')
      .send({
        name: 'Producer Name',
        cpfCnpj: '84695910020',
      })
      .expect(201)) as { body: Producer };

    (await request(app.getHttpServer())
      .post('/api/v1/farm')
      .send({
        name: 'To Be Invalid Name',
        city: 'City Test',
        stateId: (states[0] as { id: string }).id,
        producerId: (producer as { id: string }).id,
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      })
      .expect(201)) as { body: Farm };
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

    const input = {
      name: 'To Be Invalid Name',
      totalArea: 7.5,
      vegetationArea: 5.5,
      arableArea: 2.0,
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/v1/farm/${farm.id}`)
      .send(input)
      .expect(409);
    expect(response.status).toBe(409);
    expect((response.body as { message: string }).message).toBe(
      'A farm with this name already exist for this producer.',
    );
  });

  it('With unexisting farm', async () => {
    const input = {
      name: 'To Be Invalid Name',
      totalArea: 7.5,
      vegetationArea: 5.5,
      arableArea: 2.0,
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/v1/farm/69b0e571-90b8-4bb7-ad33-0c45fa7c2692`)
      .send(input)
      .expect(404);
    expect(response.status).toBe(404);
    expect((response.body as { message: string }).message).toBe(
      'Farm was not found.',
    );
  });
});
