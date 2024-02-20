import { Transfer } from '../../../apps/transfer/src/models/quote';

export const transferStub = (): Transfer => {
  return {
    id: 1,
    title: 'Tei',
    content: 'Lee',
    userId: 1,
  };
};
