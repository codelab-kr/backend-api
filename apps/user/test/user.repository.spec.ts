import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../src/repositories/user.repository';
import { User } from '@app/common';
import { userStub } from './stubs/user.stub';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserRepository', () => {
  let repository: UserRepository;
  let saveSpy: jest.SpyInstance;
  let findSpy: jest.SpyInstance;
  let findOneBySpy: jest.SpyInstance;
  let updateSpy: jest.SpyInstance;
  let softDeleteSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(userStub()),
            find: jest.fn().mockResolvedValue([userStub()]),
            findOne: jest.fn().mockResolvedValue(userStub()),
            findOneBy: jest.fn().mockResolvedValue(userStub()),
            update: jest.fn().mockResolvedValue(userStub()),
            softDelete: jest.fn().mockResolvedValue(userStub()),
          },
        },
        UserRepository,
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    saveSpy = jest.spyOn(repository, 'save');
    findSpy = jest.spyOn(repository, 'find');
    findOneBySpy = jest.spyOn(repository, 'findOneBy');
    updateSpy = jest.spyOn(repository, 'update');
    softDeleteSpy = jest.spyOn(repository, 'softDelete');
  });

  afterEach(() => {
    saveSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a user', async () => {
    const user = new User();
    user.id = userStub().id;
    user.password = userStub().password;
    user.name = userStub().name;

    saveSpy.mockResolvedValue(user);
    const createdUser = await repository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    expect(createdUser).toEqual(expect.objectContaining(result));
    expect(saveSpy).toHaveBeenCalledWith(user);
  });

  it('should find a user by id', async () => {
    const user = userStub();
    saveSpy.mockResolvedValue(user);
    await repository.save(user);
    findOneBySpy.mockResolvedValue(user);
    const foundUser = await repository.findOneBy({ id: user.id });
    expect(foundUser).toEqual(user);
  });

  it('should find user', async () => {
    const user = [userStub()];
    findSpy.mockResolvedValue(user);
    const foundUser = await repository.find();
    expect(foundUser).toEqual(user);
  });

  it('should update a user', async () => {
    const user = userStub();
    const updatedUser: User = { ...user, name: 'updated' };
    saveSpy.mockResolvedValue(user);
    updateSpy.mockResolvedValue(user);
    updateSpy.mockResolvedValue(updatedUser);
    await repository.save(user);
    const result = await repository.update(user.id, updatedUser);
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    const user = userStub();
    saveSpy.mockResolvedValue(user);
    softDeleteSpy.mockResolvedValue(user);
    findOneBySpy.mockResolvedValue(null);
    await repository.save(user);
    await repository.softDelete(user.id);
    const deletedUser = await repository.findOneBy({ id: user.id });
    expect(deletedUser).toBeNull();
  });
});
