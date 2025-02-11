import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { faker } from '@faker-js/faker';
import { UserService } from '../user/user.service';
import { AddressTestModule } from './address.module';

describe('AddressController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let userTestService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AddressTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    userTestService = app.get(UserService);
  });

  describe('POST /api/address', () => {
    it('should be token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/address')
        .set('authorization', '');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.error).toBeDefined();
    });

    it('should be able to add address', async () => {
      const token = await userTestService.getUSersToken();

      const response = await request(app.getHttpServer())
        .post('/api/address')
        .set('authorization', `Bearer ${token}`)
        .send({
          street: faker.address.street(),
          city: faker.address.city(),
          country: faker.address.country(),
          postal_code: faker.address.zipCode(),
          province: faker.address.state(),
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
    });
  });

  describe('GET /api/address', () => {
    it('should be token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/address')
        .set('authorization', '');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.error).toBeDefined();
    });

    it('should be able to get address', async () => {
      const token = await userTestService.getUSersToken();

      const response = await request(app.getHttpServer())
        .get('/api/address')
        .set('authorization', `Bearer ${token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/address/update/:id', () => {
    it('should be token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/address/update/6')
        .set('authorization', '');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.error).toBeDefined();
    });

    it('should be able to update address', async () => {
      const token = await userTestService.getUSersToken();

      const response = await request(app.getHttpServer())
        .put('/api/address/update/6')
        .set('authorization', `Bearer ${token}`)
        .send({
          street: faker.address.street(),
          city: faker.address.city(),
          country: faker.address.country(),
          postal_code: faker.address.zipCode(),
          province: faker.address.state(),
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });
});
