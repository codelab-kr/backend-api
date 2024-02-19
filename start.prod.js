const app = process.argv[2];

if (!app) {
  throw new Error('No app name provided');
}
const script = `node dist/apps/${app}/src/main.js`;
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('child_process').execSync(script, { stdio: 'inherit' });
