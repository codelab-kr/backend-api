import { EventEmitter } from 'events';
import { readFile } from 'fs';

class FindRegex extends EventEmitter {
  regex: RegExp;
  files: string[];

  constructor(regex: RegExp, files: string[] = []) {
    super();
    this.regex = regex;
    this.files = files;
  }

  // addFile(file: string) {
  //   this.files.push(file);
  //   return this;
  // }

  find() {
    this.emit('start', this.files);
    this.files.forEach((file) => {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err);
        }

        this.emit('fileread', file);

        let match = null;
        if ((match = content.match(this.regex))) {
          match.forEach((elem) => this.emit('found', file, elem));
        }
      });
    });
    return this;
  }
}

function ticker(num: number, cb: (err: Error, count: number) => void) {
  const emitter = new EventEmitter();
  let count = 0;
  setImmediate(() => {
    Date.now() % 5 === 0 && cb(new Error('Something went wrong'), count);
    emitter.emit('tick', count++);
  });
  const interval = setInterval(() => {
    Date.now() % 5 === 0 && cb(new Error('Something went wrong'), count);
    emitter.emit('tick', count++);
  }, 50);
  setTimeout(() => {
    clearInterval(interval);
    cb(null, count);
  }, num);

  return emitter;
}

function ticker2(num: number, cb: (err: Error, count: number) => void) {
  const emitter = new EventEmitter();
  let count = 0;
  const doTick = () => {
    if (Date.now() % 5 === 0) {
      // emitter.emit('error', new Error('Something went wrong'));
      return cb(new Error('Something went wrong'), count);
    }
    emitter.emit('tick', count++);
  };

  setImmediate(doTick);
  const interval = setInterval(doTick, 50);
  setTimeout(() => {
    clearInterval(interval);
    cb(null, count);
  }, num);

  return emitter;
}

export { FindRegex, ticker, ticker2 };
