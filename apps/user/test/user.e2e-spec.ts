import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/user.module';
import { userStub } from './stubs/user.stub';
import { DataSource } from 'typeorm';

describe('User - /user (e2e)', () => {
  const user = {
    id: userStub().id,
    password: userStub().password,
    name: userStub().name,
  };

  const savedUser: any = {};

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const dataSource = app.get(DataSource);
    await dataSource.synchronize();
    await app.startAllMicroservices();
    await app.init();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    if (dataSource) {
      await dataSource.dropDatabase();
      dataSource.destroy();
    }
    await app.close();
  });

  it('Create [POST /user]', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResult } = user;
    return request(app.getHttpServer())
      .post('/user')
      .send(user)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(expect.objectContaining(userResult));
        savedUser.id = body.id;
      });
  });

  it('Get all user [GET /user]', async () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Get one user [GET /user/:id]', async () => {
    return request(app.getHttpServer())
      .get(`/user/${savedUser.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Delete one user [DELETE /user/:id]', async () => {
    return request(app.getHttpServer())
      .delete(`/user/${savedUser.id}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
