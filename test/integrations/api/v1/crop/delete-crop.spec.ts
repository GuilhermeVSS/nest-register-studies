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

describe('DELETE api/v1/crop/:id', () => {
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
        name: 'Producer Delete Crop Test Name',
        cpfCnpj: '38317832090',
      })
      .expect(201)) as { body: Producer };

    const { body: farm } = (await request(app.getHttpServer())
      .post('/api/v1/farm')
      .send({
        name: 'Farm Delete Crop Test',
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
      .send({
        name: 'Harvest Delete Crop Test Name',
        year: 2025,
        farmId: farm.id,
      })
      .expect(201)) as { body: Harvest };

    const { body: crop } = (await request(app.getHttpServer())
      .post('/api/v1/crop')
      .send({
        name: 'Delete Crop Test name',
        harvestId: harvest.id,
      })
      .expect(201)) as { body: Crop };

    const response = await request(app.getHttpServer())
      .delete(`/api/v1/crop/${crop.id}`)
      .expect(200);
    expect((response.body as { message: string }).message).toBe(
      'Crop has been deleted successfully.',
    );
    expect((response.body as { cropId: string }).cropId).toBe(crop.id);
  });

  it('With invalid CropId', async () => {
    await request(app.getHttpServer())
      .delete('/api/v1/crop/f67cd0cc-b9b2-4e1c-8d79-81a3c88356a0')
      .expect(404);
  });
});
