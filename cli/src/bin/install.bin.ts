import execa from 'execa';
import { Sade } from 'sade';
import ora from 'ora';

import { logError } from '../errors';
import {
  findWorkspacePackage,
  findWorkspaceRoot
} from '../helpers/utils/package.utils';
import { defineDependencyFlag } from '../helpers/utils/dependency.utils';
import { InstallMessages } from '../helpers/messages/install.messages';

export const installBinCommand = (prog: Sade) => {
  prog
    .command(
      'install',
      `Install one or more dependencies to the workspace root. Run this script inside any package and re-space will add peer dependencies as well.`,
      {
        // eslint-disable no-param-reassign

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        alias: ['i']
      }
    )
    .example('install libraryName')
    .option('--dev', 'Install development dependencies')
    .example(`install libraryName --dev`)
    .option('-d', 'Install development dependencies')
    .example(`install libraryName -D`)
    .action(async (opts: CLI.InstallOptions) => {
      const { _: dependencies, dev, d } = opts;
      const dependencyFlag = defineDependencyFlag(dev, d);
      const { installing, failed, successful } = new InstallMessages(dependencies);
      const bootSpinner = ora(installing());

      if (typeof d === 'string') {
        dependencies.push(d);
      }

      if (typeof dev === 'string') {
        dependencies.push(dev);
      }

      try {
        bootSpinner.start();
        const workspacePackage = await findWorkspacePackage();
        const workspaceRoot = await findWorkspaceRoot();

        if (workspacePackage !== null) {
          await execa(`yarn add ${dependencies.join(' ')}`, ['--peer'], {
            cwd: workspacePackage
          });
        }

        if (workspaceRoot !== null) {
          await execa(
            `yarn add ${dependencies.join(' ')} ${dependencyFlag}`,
            ['--exact', '-W'],
            { cwd: workspaceRoot }
          );
        }

        bootSpinner.succeed(successful());
      } catch (e) {
        bootSpinner.fail(failed());
        logError(e);
      }
    });
};
