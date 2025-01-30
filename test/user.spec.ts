import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { faker } from '@faker-js/faker';

describe('UserController', () => {
  let app: INestApplication<App>;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
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
      const response = await request(app.getHttpServer())
        .get('/api/users/me')
        .set(
          'authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImlhdCI6MTczODIwNTQ2NCwiZXhwIjoxNzM4MjkxODY0fQ.LQbRuwpaGrYuivVBI3hgD-yoCk-NVXK2QWyR2sWiFC0',
        );

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
      const response = await request(app.getHttpServer())
        .put('/api/users/update')
        .set(
          'authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxpbmRzZXkuV29sZmY2NSIsInBhc3N3b3JkIjoicGFzc3dvcmQiLCJpYXQiOjE3MzgyMDkyMTQsImV4cCI6MTczODI5NTYxNH0.Rwr0iEjvhRPK9g2pVbLU6cTJmhRfVFqvCPjGR6lPMi4',
        )
        .send({
          name: faker.person.fullName(),
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });
});
