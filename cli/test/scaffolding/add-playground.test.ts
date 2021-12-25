import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'add-playground';

describe('[bin.scaffolding.add-playground]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should have playground folder', () => {
    const output = smartExec('node ../../../dist/bundle.cjs add playground');
    expect(shell.test('-d', 'playground')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  const addDocz = () => smartExec('node ../../../dist/bundle.cjs add docz');

  it('should have bootstrap script in the package.json', () => {
    const output = addDocz();
    const packageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(packageJson.scripts).toHaveProperty('start:playground');
    expect(output.code).toBe(0);
  });

  it('should have correct bootstrap script value', () => {
    const output = addDocz();
    const packageJson = fs.readJSONSync(path.resolve('package.json'));
    expect(packageJson.scripts['start:playground']).toBe(
      'yarn build & npx concurrently --kill-others "yarn start" "cd playground & yarn start"'
    );
    expect(output.code).toBe(0);
  });
});
