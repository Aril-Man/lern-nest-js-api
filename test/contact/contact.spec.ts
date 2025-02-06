import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { faker } from '@faker-js/faker';
import { ContactTestModule } from './constact.module';
import { UserService } from '../user/user.service';

describe('UserController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let userTestService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ContactTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    userTestService = app.get(UserService);
  });

  describe('POST /api/contact', () => {
    it('should be token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contact')
        .set('authorization', '')
        .send({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.error).toBeDefined();
    });

    it('should be able to add contact', async () => {
      const token = await userTestService.getUSersToken();

      const response = await request(app.getHttpServer())
        .post('/api/contact')
        .set('authorization', `Bearer ${token}`)
        .send({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/contact', () => {
    it('should be token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contact')
        .set('authorization', '');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.error).toBeDefined();
    });

    it('should be able to get contact', async () => {
      const token = await userTestService.getUSersToken();

      const response = await request(app.getHttpServer())
        .get('/api/contact')
        .set('authorization', `Bearer ${token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/contact', () => {
    it('should be token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/contact')
        .set('authorization', '');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.error).toBeDefined();
    });

    it('should be able to delete contact', async () => {
      const token = await userTestService.getUSersToken();

      const response = await request(app.getHttpServer())
        .delete('/api/contact')
        .set('authorization', `Bearer ${token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });
});
