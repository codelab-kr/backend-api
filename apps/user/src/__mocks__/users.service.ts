import { usertub } from '../../test/stubs/user.stub';

export const UserService = jest.fn().mockReturnValue({
  createUser: jest.fn().mockResolvedValue(usertub()),
  validateUser: jest.fn().mockResolvedValue(usertub()),
  // updateUser: jest.fn().mockResolvedValue({
  //   generatedMaps: [],
  //   raw: [],
  //   affected: 1,
  // }),
  // deleteUser: jest.fn().mockResolvedValue({
  //   generatedMaps: [],
  //   raw: [],
  //   affected: 1,
  // }),
  // getUser: jest.fn().mockResolvedValue([usertub()]),
  // getUserById: jest.fn().mockResolvedValue(usertub()),
  // getOrSaveUser: jest.fn().mockResolvedValue(usertub()),
});
