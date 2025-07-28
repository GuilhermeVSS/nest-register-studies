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

interface Harvest {
  id: string;
}

interface Crop {
  id: string;
}

describe('PATCH api/v1/crop/:id', () => {
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
        name: 'Producer Update Crop Name',
        cpfCnpj: '21524126055',
      })
      .expect(201)) as { body: Producer };

    const { body: farm } = (await request(app.getHttpServer())
      .post('/api/v1/farm')
      .send({
        name: 'Farm Update Crop Test',
        city: 'City Test',
        stateId: (states[0] as { id: string }).id,
        producerId: (producer as { id: string }).id,
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      })
      .expect(201)) as { body: Farm };

    const { body: harvest } = (await request(app.getHttpServer())
      .post('/api/v1/harvest')
      .send({ name: 'Harvest Update Crop Name', year: 2025, farmId: farm.id })
      .expect(201)) as { body: Harvest };

    const { body: crop } = (await request(app.getHttpServer())
      .post('/api/v1/crop')
      .send({
        name: 'Update Crop name',
        harvestId: harvest.id,
      })
      .expect(201)) as { body: Crop };

    const input = {
      name: 'Updating Name',
    };
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/crop/${crop.id}`)
      .send(input)
      .expect(200);
    expect((response.body as { name: string }).name).toBe(input.name);
  });

  it('With invalid CropId', async () => {
    const input = {
      name: 'Invalid Harvest Id',
    };

    await request(app.getHttpServer())
      .patch('/api/v1/crop/f67cd0cc-b9b2-4e1c-8d79-81a3c88356a0')
      .send(input)
      .expect(404);
  });
});
