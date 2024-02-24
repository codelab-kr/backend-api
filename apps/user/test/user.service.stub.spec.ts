import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user.service';
import { UserRepository } from '../src/repositories/user.repository';
import { User } from '@app/common';
import { userStub } from './stubs/user.stub';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn().mockResolvedValue(userStub()),
            findOneBy: jest.fn().mockResolvedValue(userStub()),
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

      const request: User = userStub();

      beforeEach(async () => {
        userRepository.findOneBy = jest.fn().mockResolvedValue(null);
        saveSpy = jest.spyOn(userRepository, 'save');
        // .mockResolvedValue(userStub());
        user = await userService.createUser(request);
      });

      test('then it should call userRepository', async () => {
        expect(saveSpy).toHaveBeenCalledWith({
          ...request,
          password: expect.any(String),
          idValue: expect.any(String),
        });
      });

      test('then it should return a user', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, idValue, ...userWithoutPassword } = userStub();
        expect(user).toEqual(userWithoutPassword);
      });
    });
  });
});
