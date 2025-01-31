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
      const response = await request(app.getHttpServer())
        .post('/api/contact')
        .set(
          'authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImlhdCI6MTczODI4Mzg5MywiZXhwIjoxNzM4MzcwMjkzfQ.zGnuSoRPMds3x3XSjhdqvY2MoLKgzWSJ757O0O4bVV4',
        )
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
});
