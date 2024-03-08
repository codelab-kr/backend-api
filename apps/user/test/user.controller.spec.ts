import { Test, TestingModule } from '@nestjs/testing';
import { User, LoginUserRequest, CreateUserRequest } from '@app/common';
import { UserController } from '../src/user.controller';
import { UserService } from '../src/user.service';
import { userStub } from './stubs/user.stub';

jest.mock('../src/user.service');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  test('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let user: Partial<User>;
      let request: CreateUserRequest;

      beforeEach(async () => {
        request = userStub();
        user = await userController.createUser(request);
      });

      test('then it should call userService', async () => {
        expect(userService.createUser).toHaveBeenCalledWith(request);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(expect.objectContaining(request));
      });
    });
  });

  describe('validateUser', () => {
    describe('when validateUser is called', () => {
      let user: Partial<User>;
      let request: LoginUserRequest;

      beforeEach(async () => {
        request = userStub();
        user = await userController.validateUser(request);
      });

      test('then it should call userService', async () => {
        expect(userService.validateUser).toHaveBeenCalledWith(request);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(expect.objectContaining(request));
      });
    });
  });
});
