import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user.service';
import { UserRepository } from '../src/repositories/user.repository';
import { User } from '@app/common';
import { usertub } from './stubs/user.stub';
import { UpdateResult } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  const updateResult: UpdateResult = {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn().mockResolvedValue(usertub()),
            find: jest.fn().mockResolvedValue([usertub()]),
            findOne: jest.fn().mockResolvedValue(usertub()),
            findOneBy: jest.fn().mockResolvedValue(usertub()),
            update: jest.fn().mockResolvedValue(updateResult),
            softDelete: jest.fn().mockResolvedValue(updateResult),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);

    jest.clearAllMocks();
  });

  test('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let user: Partial<User>;
      let saveSpy: jest.SpyInstance;

      const request: User = usertub();

      beforeEach(async () => {
        userRepository.findOneBy = jest.fn().mockResolvedValue(null);
        saveSpy = jest.spyOn(userRepository, 'save');
        // .mockResolvedValue(usertub());
        user = await userService.createUser(request);
      });

      test('then it should call userRepository', async () => {
        expect(saveSpy).toHaveBeenCalledWith({
          ...request,
          password: expect.any(String),
        });
      });

      test('then it should return a user', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = usertub();
        expect(user).toEqual(userWithoutPassword);
      });
    });
  });

  // describe('getUser', () => {
  //   describe('when getUser is called', () => {
  //     let user: User[];
  //     let findSpy: jest.SpyInstance;

  //     beforeEach(async () => {
  //       findSpy = jest.spyOn(userRepository, 'find');
  //       user = await userService.getUser();
  //     });

  //     test('then it should call userRepository', async () => {
  //       expect(findSpy).toHaveBeenCalled();
  //     });

  //     test('then it should return user', () => {
  //       expect(user).toStrictEqual([usertub()]);
  //     });
  //   });
  // });

  // describe('getUserById', () => {
  //   describe('If user do not exist, It shuld throw Exception', () => {
  //     let findSpy: jest.SpyInstance;
  //     const id = usertub().id;

  //     beforeEach(async () => {
  //       findSpy = jest
  //         .spyOn(userRepository, 'findOneBy')
  //         .mockResolvedValue(null);
  //     });

  //     test('then it should return NotFoundException', async () => {
  //       await expect(userService.getUserById(id)).rejects.toThrow(
  //         UnprocessableEntityException,
  //       );
  //     });

  //     test('then it should call userRepository', async () => {
  //       try {
  //         await userService.getUserById(id);
  //       } catch (error) {
  //         expect(findSpy).toHaveBeenCalledWith({ id });
  //       }
  //     });
  //   });

  //   describe('If user exists, It shuld return a user', () => {
  //     let user: User;
  //     let findSpy: jest.SpyInstance;
  //     const id = usertub().id;

  //     beforeEach(async () => {
  //       findSpy = jest.spyOn(userRepository, 'findOneBy');
  //       user = await userService.getUserById(id);
  //     });

  //     test('then it should call userRepository', async () => {
  //       expect(findSpy).toHaveBeenCalledWith({ id });
  //     });

  //     test('then it should return a user', async () => {
  //       expect(user).toEqual(usertub());
  //     });
  //   });
  // });

  // describe('updateUser', () => {
  //   describe('If user do not exist', () => {
  //     let findSpy: jest.SpyInstance;
  //     const request: Partial<User> = {
  //       id: usertub().id,
  //       name: usertub().name,
  //     };

  //     beforeEach(async () => {
  //       findSpy = jest
  //         .spyOn(userRepository, 'findOneBy')
  //         .mockResolvedValue(null);
  //     });

  //     test('then it should return UnprocessableEntityException', async () => {
  //       await expect(userService.updateUser(request)).rejects.toThrow(
  //         UnprocessableEntityException,
  //       );
  //     });

  //     test('then it should call userService', async () => {
  //       try {
  //         await userService.getUserById(request.id);
  //       } catch (error) {
  //         expect(findSpy).toHaveBeenCalledWith({ id: request.id });
  //       }
  //     });
  //   });

  //   describe('If user exists. it shuld modify and return a user)', () => {
  //     let updateResulet: any;
  //     let findSpy: jest.SpyInstance;
  //     let saveSpy: jest.SpyInstance;
  //     let request: Partial<User>;

  //     request = {
  //       id: usertub().id,
  //       name: usertub().name,
  //     };

  //     beforeEach(async () => {
  //       findSpy = jest.spyOn(userRepository, 'findOneBy');
  //       saveSpy = jest.spyOn(userRepository, 'update');

  //       request = { ...usertub(), ...request };
  //       updateResulet = await userService.updateUser(request);
  //     });

  //     test('then it should call userRepository', async () => {
  //       expect(findSpy).toHaveBeenCalledWith({ id: request.id });
  //       expect(saveSpy).toHaveBeenCalledWith(request.id, {
  //         ...request,
  //         password: expect.any(String),
  //       });
  //     });

  //     test('then it should return a user', async () => {
  //       expect(updateResulet).toEqual(updateResult);
  //     });
  //   });

  //   describe('deleteUser', () => {
  //     describe('If user exsists, It should delete a user', () => {
  //       const id = usertub().id;
  //       let deleteSpy: jest.SpyInstance;
  //       let result: UpdateResult;

  //       beforeEach(async () => {
  //         deleteSpy = jest.spyOn(userRepository, 'softDelete');
  //         result = await userService.deleteUser(id);
  //       });

  //       test('then it should call userRepository', async () => {
  //         expect(deleteSpy).toHaveBeenCalledWith({ id });
  //       });

  //       test('then it should return undefined', () => {
  //         expect(result).toEqual(updateResult);
  //       });
  //     });
  //   });
  // });
});
