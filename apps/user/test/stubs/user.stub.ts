import { User } from '../../src/models/user';

export const usertub = (): User => {
  return {
    id: '880a96c8-1407-4ebb-8b95-c5f0bdf93c18',
    email: 'test1@test.com',
    password: 'abcd1234',
    username: 'test1',
    isSubscribed: true,
    providerId: null,
    photo: null,
    paymentId: null,
    createdAt: new Date('2024-01-15 02:26:53.231188'),
    updatedAt: new Date('2024-01-15 02:26:53.231188'),
    deletedAt: null,
    payments: [],
  };
};
