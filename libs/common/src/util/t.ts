import { FindRegex } from './test';

const findRegexInstance = new FindRegex(/hello \w+/, [
  'fileA.txt',
  'fileB.json',
]);

findRegexInstance
  // .addFile('fileA.txt')
  // .addFile('fileB.json')
  .on('start', (files) => console.log(`Searching in ${files}`))
  .find()
  .on('found', (file, match) =>
    console.log(`Matched "${match}" in file ${file}`),
  )
  .on('error', (err) => console.log(`Error emitted ${err.message}`));
