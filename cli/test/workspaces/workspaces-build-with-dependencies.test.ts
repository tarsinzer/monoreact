import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixture = 'workspaces-build-with-dependencies';

describe('[bin.execution.workspaces-build-with-dependencies]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture });
  });

  afterAll(() => {
    teardownStage(fixture);
  });

  const run = () => smartExec('node ../../../dist/bundle.cjs workspaces build');

  it('should compile packages', () => {
    const output = run();
    expect(output.code).toBe(0);
  });

  it('should have compiled shared output', () => {
    const output = run();
    expect(shell.test('-d', 'shared/workspaces-example-1/dist')).toBeTruthy();
    expect(shell.test('-d', 'shared/workspaces-example-2/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have compiled services output', () => {
    const output = run();
    expect(shell.test('-d', 'services/workspaces-example-3/dist')).toBeTruthy();
    expect(shell.test('-d', 'services/workspaces-example-4/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });

  it('should have compiled components output', () => {
    const output = run();
    expect(shell.test('-d', 'components/workspaces-example-5/dist')).toBeTruthy();
    expect(shell.test('-d', 'components/workspaces-example-6/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});
