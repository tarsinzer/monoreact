import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'execution';
const fixture = 'test-default';

describe('[bin.execution.test.default]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  it('should finish positive tests', () => {
    const output = smartExec('node ../../../dist/bundle.cjs test');
    expect(output.code).toBe(0);
  });

  it('should fail, with no found tests with pattern arg and finish with code 1', () => {
    const output = smartExec('node ../../../dist/bundle.cjs test patternTest');
    expect(output.code).toBe(1);
  });

  it('should not find any test with pattern arg and passWithNoTests option and finish with code 0', () => {
    const output = smartExec('node ../../../dist/bundle.cjs test patternTest --passWithNoTests');
    expect(output.code).toBe(0);
  });
});
