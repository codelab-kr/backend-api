import { Transfer } from '../../src/models/transfer';

export const transferStub = (): Transfer => {
  return {
    id: 1,
    title: 'Tei',
    content: 'Lee',
    userId: 1,
  };
};
