import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../src/user/user.module';
import { userStub } from '../stubs/user.stub';
import * as request from 'supertest';

// e2e tests: 테스트 데이터베이스를 사용하여 end-to-end 테스트를 수행하기 위해서는
// 수신대상이 되는 마이크로서비스를 테스트 데이터베이스에 연결한 후 테스트를 수행해야 한다.
// (apps/users/.env 파일 'NODE_ENV=test'로 설정 후 docker-compose up -V 명령어로 테스트 데이터베이스를 실행한다.)
describe('User - /user (e2e)', () => {
  const user = userStub();

  let app: INestApplication;

  beforeAll(async () => {
    const moduleApp: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '/.env',
        }),
      ],
    }).compile();

    app = moduleApp.createNestApplication();
    await app.startAllMicroservices();
    await app.listen(4000, 'localhost');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Create [POST /user/signup]', async () => {
    return request(app.getHttpServer())
      .post('/user/signup')
      .send(user as any)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            resultCode: '200 (HttpStatus.OK)',
            resultMsg: 'OK',
          }),
        );
      });
  });

  it('Create [POST /user/signup]', async () => {
    return request(app.getHttpServer())
      .post('/user/signup')
      .send(user as any)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            resultCode: '400 (HttpStatus.BAD_REQUEST)',
            resultMsg: '잘못된 파라미터 입니다.',
          }),
        );
      });
  });

  it('Login [POST /user/login]', async () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send(user as any)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            resultCode: '200 (HttpStatus.OK)',
            resultMsg: 'OK',
          }),
        );
      });
  });

  it('Login [POST /user/login]', async () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send({ id: 'user', password: '1234' } as any)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            resultCode: '400 (HttpStatus.BAD_REQUEST)',
            resultMsg: '잘못된 파라미터 입니다.',
          }),
        );
      });
  });
});
