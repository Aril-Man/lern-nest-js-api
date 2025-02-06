import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { faker } from '@faker-js/faker';
import { UserTestModule } from './user.module';
import { UserService } from './user.service';

describe('UserController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let userTestService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    userTestService = app.get(UserService);
  });

  describe('POST /api/users', () => {
    it('should be register is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: faker.internet.username(),
          password: 'password',
          name: faker.person.fullName(),
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/users/login', () => {
    it('should be login is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'admin',
          password: 'password',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/users/me', () => {
    it('should be token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/me')
        .set('authorization', '');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.error).toBeDefined();
    });

    it('should be able to get user', async () => {
      const token = await userTestService.getUSersToken();

      const response = await request(app.getHttpServer())
        .get('/api/users/me')
        .set('authorization', `Bearer ${token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/users/update', () => {
    it('should be token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/users/update')
        .set('authorization', '');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.error).toBeDefined();
    });

    it('should be able to update', async () => {
      const token = await userTestService.getUSersToken();

      const response = await request(app.getHttpServer())
        .put('/api/users/update')
        .set('authorization', `Bearer ${token}`)
        .send({
          name: faker.person.fullName(),
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });
});
