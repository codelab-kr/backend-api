import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../src/models/user';
import { UserController } from '../src/user.controller';
import { UserService } from '../src/user.service';
import { CreateUserDto } from '../src/dtos/create.user.dto';
import { UpdateUserDto } from '../src/dtos/update.user.dto';
import { LoginUserRequest } from '../src/dtos/login.user.dto';
import { usertub } from './stubs/user.stub';
import { UpdateResult } from 'typeorm';

jest.mock('../src/user.service');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const updateResult: UpdateResult = {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };

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
      let user: User;
      let request: CreateUserDto;

      beforeEach(async () => {
        request = {
          email: usertub().email,
          password: usertub().password,
          username: usertub().username,
        };
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

  describe('getUser', () => {
    describe('when getUser is called', () => {
      let user: User[];

      beforeEach(async () => {
        user = await userController.getUser();
      });

      test('then it should call userService', async () => {
        expect(userService.getUser).toHaveBeenCalled();
      });

      test('then it should return user', () => {
        expect(user).toEqual([usertub()]);
      });
    });
  });

  describe('validateUser', () => {
    describe('when validateUser is called', () => {
      let user: User;
      let request: LoginUserRequest;

      beforeEach(async () => {
        request = {
          email: usertub().email,
          password: usertub().password,
        };
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

  describe('getUserByEmail', () => {
    describe('when getUserByEmail is called', () => {
      let user: User;
      let email: string;

      beforeEach(async () => {
        email = usertub().email;
        user = await userController.getUserByEmail(email);
      });

      test('then it should call userService', async () => {
        expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(expect.objectContaining({ email }));
      });
    });
  });

  describe('getUserById', () => {
    describe('when getUserById is called', () => {
      let user: User;
      let id: string;

      beforeEach(async () => {
        id = usertub().id;
        user = await userController.getUserById(id);
      });

      test('then it should call userService', async () => {
        expect(userService.getUserById).toHaveBeenCalledWith(id);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(expect.objectContaining({ id }));
      });
    });
  });

  describe('getOrSaveUser', () => {
    describe('when getOrSaveUser is called', () => {
      let user: User;
      let request: CreateUserDto;

      beforeEach(async () => {
        request = {
          email: usertub().email,
          password: usertub().password,
          username: usertub().username,
        };
        user = await userController.getOrSaveUser(request);
      });

      test('then it should call userService', async () => {
        expect(userService.getOrSaveUser).toHaveBeenCalledWith(request);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(expect.objectContaining(request));
      });
    });
  });

  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      let user: User;
      let request: UpdateUserDto;

      beforeEach(async () => {
        request = {
          id: usertub().id,
          password: usertub().password,
          username: usertub().username,
        };
        user = await userController.updateUser(request);
      });

      test('then it should call userService', () => {
        expect(userService.updateUser).toHaveBeenCalledWith(request);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(updateResult);
      });
    });
  });

  describe('deleteUser', () => {
    describe('when deleteUser is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await userController.deleteUser(usertub().id);
      });

      test('then it should call userService', () => {
        expect(userService.deleteUser).toHaveBeenCalledWith(usertub().id);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(updateResult);
      });
    });
  });
});
