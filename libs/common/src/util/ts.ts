import { ticker2 } from './test';

const tt = ticker2(1000, (err: Error, count: number) => {
  if (err) {
    return console.error('======>>>', err.message);
  }
  console.log('=======>', count);
});

tt.on('tick', (count: number) => console.log(`Ticked ${count} times`));
// .on('error', (err: Error) => console.log('Error emitted', err.message),);
