import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';
import { getJsonByRelativePath } from '../utils';

shell.config.silent = false;

const testDir = 'scaffolding';
const fixture = 'add-playground';
const template = 'add';

describe('[bin.scaffolding.add-playground]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs add playground');

  it('should have playground folder', () => {
    const output = run();
    expect(shell.test('-d', 'playground')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have bootstrap script in the package.json', () => {
    const output = run();
    const packageJson = getJsonByRelativePath('./package.json');
    expect(packageJson.scripts).toHaveProperty('start:playground');
    expect(output.code).toBe(0);
  });

  it('should have correct bootstrap script value', () => {
    const output = run();
    const packageJson = getJsonByRelativePath('./package.json');
    expect(packageJson.scripts['start:playground']).toBe(
      'yarn build & npx concurrently --kill-others "yarn start" "cd playground & yarn start"'
    );
    expect(output.code).toBe(0);
  });
});
