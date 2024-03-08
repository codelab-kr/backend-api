import { User, IdType } from '@app/common';

export const userStub = (): User => {
  return {
    id: '960f06ee-d26a-47df-aa1f-c98dc720546f',
    email: 'test1@test.com',
    password: 'abcd1234',
    name: 'test1',
    idType: IdType.REG_NO,
    idValue: '1111111111111',
    createdAt: new Date('2024-01-15 02:26:53.231188'),
    updatedAt: new Date('2024-01-15 02:26:53.231188'),
    deletedAt: null,
  };
};
