import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { NATS_SERVICE, NatsClientService } from '@app/common';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.sevice';

// import { CreateUserDto } from '../../src/user/dtos/create-user.dto';
// import { usertub } from '../../../user/test/stubs/user.stub';

// e2e tests: 테스트 데이터베이스를 사용하여 end-to-end 테스트를 수행하기 위해서는
// 수신대상이 되는 마이크로서비스를 테스트 데이터베이스에 연결한 후 테스트를 수행해야 한다.
describe('User Microservice (e2e)', () => {
  // const user = {
  //   email: usertub().email,
  //   password: usertub().password,
  //   username: usertub().username,
  // };
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: NATS_SERVICE,
          useClass: NatsClientService,
        },
        UserService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    // await app.listen(4030, 'localhost'); // 테스트 데이터베이스에 연결된 마이크로서비스를 실행한다.
  });

  //   it('Create [POST /user/signup]', async () => {
  //     return request(app.getHttpServer())
  //       .post('signup')
  //       .send(user as CreateUserDto)
  //       .expect(201)
  //       .then(({ body }) => {
  //         expect(body).toEqual(user);
  //       });
  //   });

  it('Get all user [GET /user]', async () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  //   it('Get one user [GET /user/:id]', async () => {
  //     return request(app.getHttpServer())
  //       .post('get-user-by-id')
  //       .send(usertub().id)
  //       .expect(200)
  //       .then(({ body }) => {
  //         expect(body).toBeDefined();
  //       });
  //   });

  //   it('Delete one user [DELETE /user/:id]', async () => {
  //     return request(app.getHttpServer())
  //       .post('delete-user')
  //       .send(usertub().id)
  //       .expect(200);
  //   });

  afterAll(async () => {
    await app.close();
  });
});
