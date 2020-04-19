import execa from 'execa';
import { Sade } from 'sade';
import ora from 'ora';

import { logError } from '../../errors';
import { InstallMessages } from '../../helpers/messages/install.messages';
import {
  findWorkspacePackageDir,
  findWorkspaceRootDir
} from '../../helpers/utils/package.utils';

export const installBinCommand = (prog: Sade) => {
  prog
    .command('install')
    .describe(
      'Install one or more dependencies to the workspace root. Run this script inside any package and re-space will add peer dependencies as well.'
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('i')
    .example('install libraryName')
    .option('D, dev', 'Install development dependencies')
    .example(`install libraryName --dev`)
    .action(async ({ _: dependencies, dev }: CLI.Options.Install) => {
      const dependencyFlag = dev ? '--dev' : '';
      const { installing, failed, successful } = new InstallMessages(
        dependencies
      );
      const installSpinner = ora(installing());

      if (typeof dev === 'string') {
        dependencies.push(dev as string);
      }

      installSpinner.start();
      try {
        const workspacePackage = await findWorkspacePackageDir(false);
        await execa(`yarn add ${dependencies.join(' ')}`, ['--peer'], {
          cwd: workspacePackage
        });

        /** it is ok if findWorkspacePackageDir will throw an error
         * it just means that we are not in the package dir
         **/
        // eslint-disable-next-line no-empty
      } catch {}

      try {
        const workspaceRoot = await findWorkspaceRootDir();
        await execa(
          `yarn add ${dependencies.join(' ')} ${dependencyFlag}`,
          ['--exact', '-W'],
          {
            cwd: workspaceRoot
          }
        );
        installSpinner.succeed(successful());
      } catch (err) {
        installSpinner.fail(failed());
        logError(err);
        process.exit(1);
      }
    });
};
