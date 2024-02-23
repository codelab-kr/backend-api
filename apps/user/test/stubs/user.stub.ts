import { User, IdType } from '@app/common';

export const usertub = (): User => {
  return {
    id: 'test1@test.com',
    password: 'abcd1234',
    name: 'test1',
    idType: IdType.REG_NO,
    idValue: '1111111111111',
    createdAt: new Date('2024-01-15 02:26:53.231188'),
    updatedAt: new Date('2024-01-15 02:26:53.231188'),
    deletedAt: null,
  };
};
