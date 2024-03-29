import * as shell from 'shelljs';

import { smartExec, setupStage, teardownStage } from '../../src/shared/utils';

shell.config.silent = false;
const testDir = 'scaffolding';
const fixture = 'new-invalid-template';
const template = 'new';

describe('[bin.scaffolding.new-invalid-template]', () => {
  beforeAll(() => {
    teardownStage(fixture);
    setupStage({ testDir, fixture, template });
  });

  afterAll(() => {
    teardownStage(fixture);
  });
  const run = () => smartExec('node ../../../dist/bundle.cjs new myProject --template someInvalidTemplateName');

  // TODO: provide select with available templates instead exit 1
  it('should fail with exit code 1', () => {
    const output = run();
    expect(output.code).toBe(1);
  });

  it('should not create new project', () => {
    run();
    expect(shell.test('-d', 'myProject')).toBeFalsy();
  });
});
